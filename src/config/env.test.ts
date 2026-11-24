import { describe, expect, it } from "vitest";
import { parseEnv, resolveAppEnv } from "./env";

const valid = {
  appEnv: "production",
  siteUrl: "https://fydaa.com/",
  api: {
    auth: "https://auth.fydaa.com",
    onboarding: "https://onboarding.fydaa.com/",
    stock: "https://stocktransaction.fydaa.com//",
    admin: "https://fydaa.in/admin/api/v4",
    payment: "https://payment.fydaa.com/",
    crm: "https://crm-prod.fydaa.com",
  },
  posthog: { host: "https://us.i.posthog.com/" },
  oauth: {},
};

describe("resolveAppEnv", () => {
  it.each(["stage", "STAGING", " dev "])("treats %j as staging", (value) => {
    expect(resolveAppEnv(value)).toBe("staging");
  });

  it.each([undefined, "", "prod", "production", "anything"])("treats %j as production", (value) => {
    expect(resolveAppEnv(value)).toBe("production");
  });
});

describe("parseEnv", () => {
  it("normalises API bases to one trailing slash and origins to none", () => {
    const env = parseEnv(valid);
    expect(env.api.auth).toBe("https://auth.fydaa.com/");
    expect(env.api.stock).toBe("https://stocktransaction.fydaa.com/");
    expect(env.api.admin).toBe("https://fydaa.in/admin/api/v4/");
    expect(env.siteUrl).toBe("https://fydaa.com");
    expect(env.posthog.host).toBe("https://us.i.posthog.com");
  });

  it("fails fast when a service URL is missing", () => {
    expect(() => parseEnv({ ...valid, api: { ...valid.api, crm: undefined } })).toThrow(
      /Invalid environment configuration[\s\S]*crm/,
    );
  });

  it("rejects relative or non-http URLs", () => {
    expect(() => parseEnv({ ...valid, api: { ...valid.api, auth: "undefinedreferrals/" } })).toThrow();
    expect(() => parseEnv({ ...valid, api: { ...valid.api, auth: "javascript:alert(1)" } })).toThrow();
  });
});
