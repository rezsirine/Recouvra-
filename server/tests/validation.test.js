// Tests de validation manuelle (sans Joi)

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSiret(siret) {
  return typeof siret === "string" && siret.length === 14;
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 6;
}

function validateAmount(amount) {
  return typeof amount === "number" && amount > 0;
}

describe("Validation manuelle", () => {
  describe("Email", () => {
    test("email valide", () => expect(validateEmail("john@example.com")).toBe(true));
    test("email invalide", () => expect(validateEmail("notanemail")).toBe(false));
    test("email sans domaine", () => expect(validateEmail("john@")).toBe(false));
  });

  describe("SIRET", () => {
    test("SIRET valide (14 chars)", () => expect(validateSiret("12345678901234")).toBe(true));
    test("SIRET trop court", () => expect(validateSiret("123")).toBe(false));
    test("SIRET trop long", () => expect(validateSiret("123456789012345")).toBe(false));
  });

  describe("Mot de passe", () => {
    test("mot de passe valide", () => expect(validatePassword("password123")).toBe(true));
    test("mot de passe trop court", () => expect(validatePassword("abc")).toBe(false));
  });

  describe("Montant", () => {
    test("montant positif valide", () => expect(validateAmount(150.5)).toBe(true));
    test("montant zéro invalide", () => expect(validateAmount(0)).toBe(false));
    test("montant négatif invalide", () => expect(validateAmount(-100)).toBe(false));
  });
});
