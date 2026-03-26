import {expect, test} from 'vitest';
import { confirmPassword } from './functions';

test("hggh", ( ) => {
    expect(confirmPassword("password123", "password123")).toBeUndefined();
    expect(confirmPassword("password123", "password321")).toBe("A két jelszó nem egyezik");
});