"""Ensure user_feedback has unique (answer_id, session_id)

Revision ID: 9f3b2c1d4a6e
Revises: 6a88424799fe
Create Date: 2025-12-18

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "9f3b2c1d4a6e"
down_revision: Union[str, None] = "6a88424799fe"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # The application uses:
    #   ON CONFLICT (answer_id, session_id) DO NOTHING
    # which requires a matching UNIQUE constraint/index.
    #
    # Keep this migration idempotent and safe to run on existing databases.
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.user_feedback (
            id            BIGSERIAL PRIMARY KEY,
            answer_id      INTEGER,
            user_email     TEXT,
            user_question  TEXT,
            feedback_text  TEXT NOT NULL,
            session_id     TEXT,
            created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ux_user_feedback_answer_id_session_id
            ON public.user_feedback (answer_id, session_id);
        """
    )


def downgrade() -> None:
    # Only remove what we added; do not drop the table because it may contain
    # production feedback data.
    op.execute(
        """
        DROP INDEX IF EXISTS public.ux_user_feedback_answer_id_session_id;
        """
    )
