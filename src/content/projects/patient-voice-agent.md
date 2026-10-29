---
title: Patient Voice Agent
slug: patient-voice-agent
order: 2
status: Working prototype
color: blue
# Headline is Claude's draft; Abdullah to confirm or rewrite.
headline: A voice agent that handles patient intake over the phone.
summary: A patient calls and talks to Maya, an AI voice coordinator, who registers them or updates their record. The backend checks details like phone, date of birth, and zip before anything is saved.
mobileSummary: Callers talk to Maya, who registers or updates their record. 47 tests passing.
why: A personal project to explore voice AI with real backend validation.
facts:
  - 47 tests passing
  - Vapi voice pipeline
  - FastAPI + Supabase
stack:
  - Python
  - FastAPI
  - PostgreSQL (Supabase)
  - SQLAlchemy
  - Vapi
# No live demo and no phone number on the site. The repo is private for now, so no
# GitHub button; when it goes public, replace `githubPrivate: true` with `github: <url>`.
links:
  githubPrivate: true
# Verify these steps against the repo before launch. Add a dashboard step only if Abdullah confirms it works.
visual:
  type: diagram
  steps:
    - title: Caller
      detail: Phone call
    - title: Vapi · Maya
      detail: Speech to text, LLM, text to speech
    - title: FastAPI webhook
      detail: Tool calls
    - title: Validation and services
      detail: Shared layer
    - title: Supabase Postgres
      detail: Patient records
published: true
---
