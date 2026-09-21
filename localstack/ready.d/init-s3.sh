#!/bin/bash
set -euo pipefail

BUCKET="${S3_BUCKET:-clinsync-uploads}"

echo "Creating LocalStack S3 bucket: ${BUCKET}"
awslocal s3 mb "s3://${BUCKET}" || true

awslocal s3api put-bucket-cors --bucket "${BUCKET}" --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173", "http://127.0.0.1:5173"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "x-amz-request-id"],
      "MaxAgeSeconds": 3000
    }
  ]
}'

echo "LocalStack S3 is ready: s3://${BUCKET}"
