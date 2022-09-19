import { getMockAccount } from '../../../test/mocks';
import { createScannerEntity } from './converter';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    expect(createScannerEntity(getMockAccount())).toMatchSnapshot();
  });
});
