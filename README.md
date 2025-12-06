# leetcode wrapped

a "spotify wrapped" style recap for your leetcode journey.

## quick start

1.  **install dependencies:**
    ```bash
    npm install
    ```

2.  **run locally:**
    ```bash
    npm run dev
    ```

3.  **build for production:**
    ```bash
    npm run build
    ```

## directory structure

```
├── src/
│   ├── api/            # api wrappers (leetcode, firebase, etc.)
│   ├── components/     # react components
│   │   └── slides/     # individual wrapped slides (intro, stats, etc.)
│   ├── App.jsx         # main application logic
│   ├── main.jsx        # entry point & providers
│   └── firebase.js     # firebase configuration
├── functions/          # cloudflare functions (server-side proxy)
├── public/             # static assets
├── firestore.rules     # database security rules
└── index.html          # html entry point
```

## tech stack

-   **frontend**: react, vite, framer motion
-   **backend**: cloudflare pages functions (proxy), firebase (db & auth)
-   **analytics**: posthog

**Note:** The last 5 slides are not neccearily specific to 2025 because of leetcode's graphql api only allows querying up to 20 of the latest submissions from an unauthenticated user. 

However, if you pass a LEETCODE_SESSION cookie (obtained from leetcode.com, open dev tools -> application -> cookies) with your request you can query all of your accounts submissions. You could also use the calendar endpoint query all of your submissions in the past year, and thus create a much more nuanced leetcode wrapped. (ex: You struggled with this problem the most in 2025.)

I was hesitant to implement this because I obviously people wouldn't trust inputting a cookie into a form, but if this repo gets lots of stars I'll make a chrome extension that gets around this. 


**Note Note:** I used firebase firestore database and trigger email extension to send out emails to users, as well as posthog for analytics. However, you can still clone the repository and run it locally without these features. 

