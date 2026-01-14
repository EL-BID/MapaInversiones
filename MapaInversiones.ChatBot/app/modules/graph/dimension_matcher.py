# dimension_matcher.py
"""
Abstracción para detectar matches de keywords contra catálogos de dimensiones.

Soporta múltiples estrategias de matching:
- substring: keyword contenido en el valor del catálogo
- prefix: el valor del catálogo comienza con el keyword
- fuzzy: similitud de strings (para strings cortos)
- alias: busca primero en diccionario de alias/abreviaciones
- tokenized: tokeniza valores del catálogo y compara stems (usa stopwords)

Uso:
    matcher = DimensionMatcher("funding", funding_catalog, strategy="substring")
    matches = matcher.find_matches(["emprendimiento", "mipymes"])
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from loguru import logger

# Import tokenizer que replica process_text() de Postgres
from modules.utils.text_processing import tokenize_like_process_text


class DimensionMatcher:
    """Detecta matches de keywords contra catálogos de dimensiones."""

    STRATEGIES = ["substring", "prefix", "fuzzy", "alias", "tokenized"]

    def __init__(
        self,
        name: str,
        catalog: List[str],
        strategy: str = "substring",
        aliases: Optional[Dict[str, List[str]]] = None,
        min_keyword_len: int = 4,
        fuzzy_threshold: float = 0.7,
    ):
        """
        Inicializa el matcher.

        Args:
            name: Nombre de la dimensión (funding, sector, entity)
            catalog: Lista de valores del catálogo
            strategy: Estrategia de matching (substring, prefix, fuzzy, alias, tokenized)
            aliases: Diccionario de alias -> [valores] para strategy="alias"
            min_keyword_len: Longitud mínima de keyword para considerar
            fuzzy_threshold: Umbral de similitud para fuzzy matching
        """
        if strategy not in self.STRATEGIES:
            raise ValueError(f"Strategy must be one of {self.STRATEGIES}")

        self.name = name
        self.strategy = strategy
        self.min_keyword_len = min_keyword_len
        self.fuzzy_threshold = fuzzy_threshold
        self.aliases = aliases or {}

        # Pre-procesar catálogo: (original, normalizado)
        self.catalog = [
            (c, c.lower().strip()) for c in catalog if c and isinstance(c, str)
        ]

        # Pre-procesar catálogo tokenizado (para strategy="tokenized")
        # Cada entrada: (original, [tokens_stemmed])
        self.catalog_tokenized: List[tuple] = []
        if strategy == "tokenized":
            for original, _ in self.catalog:
                tokens = tokenize_like_process_text(original, min_length=3)
                if tokens:
                    self.catalog_tokenized.append((original, tokens))

            # Debug: Log del catálogo tokenizado
            if self.catalog_tokenized:
                sample = [
                    (orig[:40], toks[:5]) for orig, toks in self.catalog_tokenized[:3]
                ]
                logger.debug(
                    "DIMENSION_MATCHER ▸ {} tokenized catalog: {} entries, sample={}",
                    name.upper(),
                    len(self.catalog_tokenized),
                    sample,
                )

        # Pre-procesar aliases: normalizar keys
        self.aliases_normalized = {
            k.lower().strip(): v for k, v in self.aliases.items()
        }

    def find_matches(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """
        Busca matches de keywords contra el catálogo.

        Args:
            keywords: Lista de keywords a buscar

        Returns:
            Lista de dicts con matches encontrados:
            [{"keyword": str, "matched_value": str, "dimension": str, "strategy": str, "score": float}]
        """
        matches: List[Dict[str, Any]] = []
        seen_keywords: set = set()  # Evitar duplicados

        for kw in keywords:
            if not kw or not isinstance(kw, str):
                continue

            kw_clean = kw.strip().lower()

            if len(kw_clean) < self.min_keyword_len:
                continue

            if kw_clean in seen_keywords:
                continue

            match = self._find_single_match(kw_clean)
            if match:
                seen_keywords.add(kw_clean)
                matches.append(match)

        if matches:
            logger.info(
                "DIMENSION_MATCHER ▸ {} found {} matches: {}",
                self.name.upper(),
                len(matches),
                [(m["keyword"], m["matched_value"][:50]) for m in matches],
            )

        return matches

    def _find_single_match(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Busca un match para un keyword específico."""

        # Si strategy es alias, buscar primero en diccionario de aliases
        if self.strategy == "alias":
            alias_match = self._match_alias(keyword)
            if alias_match:
                return alias_match
            # Si no hay alias, continuar con substring como fallback
            return self._match_substring(keyword)

        elif self.strategy == "substring":
            return self._match_substring(keyword)

        elif self.strategy == "prefix":
            return self._match_prefix(keyword)

        elif self.strategy == "fuzzy":
            return self._match_fuzzy(keyword)

        elif self.strategy == "tokenized":
            return self._match_tokenized(keyword)

        return None

    def _match_tokenized(self, keyword: str) -> Optional[Dict[str, Any]]:
        """
        Tokeniza el keyword y busca si algún token matchea contra tokens del catálogo.
        Usa tokenize_like_process_text que aplica stopwords y stemming.

        Ejemplo:
        - Catálogo: "MINISTERIO DE INDUSTRIA, COMERCIO Y MIPYMES"
        - Tokens catálogo: ["ministeri", "industri", "comerci", "mipym"]
        - Keyword: "pymes" → token: ["pym"]
        - Match: "pym" está contenido en "mipym" → True
        """
        # Tokenizar el keyword
        keyword_tokens = tokenize_like_process_text(keyword, min_length=3)
        if not keyword_tokens:
            logger.debug(
                "DIMENSION_MATCHER ▸ {} keyword='{}' tokenized to empty",
                self.name.upper(),
                keyword,
            )
            return None

        logger.debug(
            "DIMENSION_MATCHER ▸ {} keyword='{}' tokens={} vs catalog_entries={}",
            self.name.upper(),
            keyword,
            keyword_tokens,
            len(self.catalog_tokenized),
        )

        for original, catalog_tokens in self.catalog_tokenized:
            for kw_token in keyword_tokens:
                for cat_token in catalog_tokens:
                    # Match exacto de token
                    if kw_token == cat_token:
                        return {
                            "keyword": keyword,
                            "matched_value": original,
                            "dimension": self.name,
                            "strategy": "tokenized",
                            "score": 1.0,
                            "matched_token": cat_token,
                        }
                    # Match por substring en token (para casos como pym → mipym)
                    if len(kw_token) >= 3 and kw_token in cat_token:
                        return {
                            "keyword": keyword,
                            "matched_value": original,
                            "dimension": self.name,
                            "strategy": "tokenized",
                            "score": 0.9,
                            "matched_token": cat_token,
                        }
        return None

    def _match_substring(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Busca si el keyword está contenido en algún valor del catálogo."""
        for original, normalized in self.catalog:
            if keyword in normalized:
                return {
                    "keyword": keyword,
                    "matched_value": original,
                    "dimension": self.name,
                    "strategy": "substring",
                    "score": 1.0,
                }
        return None

    def _match_prefix(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Busca si algún valor del catálogo comienza con el keyword."""
        for original, normalized in self.catalog:
            # Buscar en cada palabra del valor normalizado
            words = normalized.split()
            for word in words:
                if word.startswith(keyword):
                    return {
                        "keyword": keyword,
                        "matched_value": original,
                        "dimension": self.name,
                        "strategy": "prefix",
                        "score": 1.0,
                    }
        return None

    def _match_fuzzy(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Busca por similitud de strings (útil para strings cortos)."""
        best_match: Optional[Dict[str, Any]] = None
        best_score = 0.0

        for original, normalized in self.catalog:
            # Comparar con cada palabra del catálogo
            words = normalized.split()
            for word in words:
                score = self._string_similarity(keyword, word)
                if score > best_score and score >= self.fuzzy_threshold:
                    best_score = score
                    best_match = {
                        "keyword": keyword,
                        "matched_value": original,
                        "dimension": self.name,
                        "strategy": "fuzzy",
                        "score": score,
                    }

        return best_match

    def _match_alias(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Busca si el keyword es un alias conocido."""
        if keyword in self.aliases_normalized:
            matched_values = self.aliases_normalized[keyword]
            # Retornar el primer valor asociado al alias
            if matched_values:
                value = (
                    matched_values[0]
                    if isinstance(matched_values, list)
                    else matched_values
                )
                return {
                    "keyword": keyword,
                    "matched_value": value,
                    "dimension": self.name,
                    "strategy": "alias",
                    "score": 1.0,
                }
        return None

    def _string_similarity(self, s1: str, s2: str) -> float:
        """
        Calcula similitud entre dos strings usando distancia de Levenshtein normalizada.
        Retorna valor entre 0 y 1.
        """
        if not s1 or not s2:
            return 0.0
        if s1 == s2:
            return 1.0

        # Implementación simple de similitud basada en caracteres comunes
        len1, len2 = len(s1), len(s2)
        max_len = max(len1, len2)

        # Contar caracteres coincidentes en posición
        matches = sum(1 for i in range(min(len1, len2)) if s1[i] == s2[i])

        # Bonus por prefijo común
        prefix_len = 0
        for i in range(min(len1, len2)):
            if s1[i] == s2[i]:
                prefix_len += 1
            else:
                break

        # Score combinado
        positional_score = matches / max_len
        prefix_score = prefix_len / max_len

        return (positional_score * 0.6) + (prefix_score * 0.4)

    def __repr__(self) -> str:
        return f"DimensionMatcher(name='{self.name}', catalog_size={len(self.catalog)}, strategy='{self.strategy}')"
