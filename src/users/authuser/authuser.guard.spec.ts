import { AuthuserGuard } from './authuser.guard';

describe('AuthuserGuard', () => {
  it('should be defined', () => {
    expect(new AuthuserGuard()).toBeDefined();
  });
});
