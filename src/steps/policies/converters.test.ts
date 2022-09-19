import { getMockPolicy } from '../../../test/mocks';
import { createPolicyEntity } from './converter';

describe('#createTeamEntity', () => {
  test('should convert to entity', () => {
    expect(createPolicyEntity(getMockPolicy())).toMatchSnapshot();
  });
});
