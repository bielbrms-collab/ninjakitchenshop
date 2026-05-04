---
name: Paradise Pags PIX Integration
description: PIX payments via Paradise Pags through Supabase Edge Function pix-payment, 15m timeout, polling
type: integration
---
PIX gateway: Paradise Pags (https://multi.paradisepags.com/api/v1/transaction.php).
Auth via header `X-API-Key` using secret `PARADISE_API_KEY` (never exposed to frontend).
Edge Function `pix-payment` (POST=create, GET=status by transactionId).
Frontend polls every 5s, 15min timeout. Forward URL query string as `utm`.
