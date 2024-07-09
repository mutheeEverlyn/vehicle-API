declare namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_API_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
  