export const accountNumberGenerator = (length: number) => {
  const accountPrefix = '1971';
  const minLength = 6;
  if (length < minLength) {
    throw new Error(
      `Cannot generate an account number with less than ${minLength} of length.`,
    );
  }

  let accountNumber = accountPrefix;

  for (let i = 0; i < (length = accountPrefix.length); i += 1) {
    accountNumber += String(Math.floor(Math.random() * 10));
  }

  return accountNumber;
};
