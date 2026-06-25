"""Aggregate module that re-exports prompts from the stage-specific packages."""

from __future__ import annotations

from . import prompts_prefetch as _prefetch
from . import prompts_fetch as _fetch
from . import prompts_postfetch as _postfetch

from .prompts_prefetch import *  # noqa: F401,F403
from .prompts_fetch import *  # noqa: F401,F403
from .prompts_postfetch import *  # noqa: F401,F403

__all__ = []
__all__ += getattr(_prefetch, "__all__", [])
__all__ += getattr(_fetch, "__all__", [])
__all__ += getattr(_postfetch, "__all__", [])
