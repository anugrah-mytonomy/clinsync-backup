# LocalStack (local S3)

LocalStack is a **Docker service** that pretends to be AWS. It is **not** part of React. The frontend only uploads files to a local URL while you develop.

In production, the backend will talk to real S3. You will not put AWS keys in the UI.

## Start

Docker Desktop must be running.

```bash
npm run localstack:up
```

Wait a few seconds, then start the app:

```bash
npm run dev
```

On Add Content, choose files and click **Upload**. Files go to a fake S3 bucket named `clinsync-uploads`.

## Stop

```bash
npm run localstack:down
```

## What the frontend does

1. User picks files in Add Content.
2. Click Upload.
3. Browser `PUT`s each file to `/s3/clinsync-uploads/library/...` (Vite proxies that to LocalStack on port 4566).

No AWS SDK and no secret keys in the app.

## Check a file landed

```bash
docker compose exec localstack awslocal s3 ls s3://clinsync-uploads/library/ --recursive
```
