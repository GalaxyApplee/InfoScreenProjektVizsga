function confirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
      return "A két jelszó nem egyezik";
    }
}

export { confirmPassword };