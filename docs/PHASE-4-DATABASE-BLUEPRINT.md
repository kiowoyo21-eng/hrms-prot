# Phase 4 Incremental Database Blueprint (not yet implemented)

Proposed tables: `document_categories`, `document_templates`, `template_versions`, `document_records`, `document_file_versions`, `document_field_mappings`, `signature_requests`, `signature_signers`, `signature_events`, `document_access_events`.

All business records carry `organization_id`, branch/employee foreign key where applicable, creating user ID, timestamps, and retention classification. Store file bytes in private object storage, metadata in PostgreSQL. Signed immutable originals with cryptographic hashes and separate compressed previews. Signature requests hold hashed tokens, expiry, recipient identity/verification method, allowed actions, and one-time redemption state. No access through public storage buckets.

Index by organization, employee, branch, document type, signed status, and upload date. Support grouped audit events and permission-filtered dynamic category counts. Review legal requirements, record retention, data privacy, and role-specific permissions before Supabase migrations.
