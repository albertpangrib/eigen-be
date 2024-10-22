import Crypto from "crypto";

interface EncryptedPassword {
  salt: string;
  hash: string;
}

const isValid = (
  salt: string,
  hashedPassword: string,
  input: string,
): boolean => {
  const hash = Crypto.pbkdf2Sync(input, salt, 1000, 64, "sha512").toString(
    "hex",
  );
  return hashedPassword === hash;
};

const encrypt = (password: string): EncryptedPassword => {
  const salt = Crypto.randomBytes(16).toString("hex");
  const hash = Crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString(
    "hex",
  );

  return {
    salt: salt,
    hash: hash,
  };
};

export default {
  isValid,
  encrypt,
};
