import { getMockImageScan, getMockVulnerability } from '../../../test/mocks';
import { createFindingEntity } from './converter';

describe('#createImageScanEntity', () => {
  test('should convert to entity', () => {
    expect(
      createFindingEntity(getMockVulnerability(), getMockImageScan().imageId),
    ).toMatchSnapshot();
  });
});
