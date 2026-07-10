"""create projects table

Revision ID: 0001_create_projects_table
Revises:
Create Date: 2026-07-08 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_create_projects_table"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("title_key", sa.String(length=255), nullable=False),
        sa.Column("description_key", sa.String(length=255), nullable=False),
        sa.Column("stack", sa.JSON(), nullable=True),
        sa.Column("github_url", sa.String(length=1024), nullable=True),
        sa.Column("website_url", sa.String(length=1024), nullable=True),
        sa.Column("image_urls", sa.JSON(), nullable=True),
        sa.Column("readme_path", sa.String(length=1024), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("NOW()"),
            nullable=False,
        ),
    )
    op.create_unique_constraint("uq_projects_slug", "projects", ["slug"])


def downgrade() -> None:
    op.drop_table("projects")
