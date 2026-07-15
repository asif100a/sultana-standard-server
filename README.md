# sultana-standard-server

To install dependencies:

```bash
bun install
```

To run the local API on Windows PowerShell, use the `.cmd` launcher so PowerShell does not block `bun.ps1` or `npm.ps1`:

```bash
npm.cmd run dev
```

The server uses `PORT=5000` from `.env`, so once the API is running you can expose it with ngrok:

```bash
npm.cmd run tunnel
```

Open the ngrok `https://...ngrok-free.dev` URL. If you see a 502, first check that this local URL works:

```text
http://localhost:5000/
```

For Firebase token verification, `FIREBASE_PROJECT_ID` must match the Expo app's Firebase project. For the most reliable local setup, also add these Firebase Admin service-account values to `.env`:

```text
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
