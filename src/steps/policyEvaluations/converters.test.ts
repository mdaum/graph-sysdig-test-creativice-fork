import {
  getMockImageScanV2,
  getMockPolicyEvaluation,
} from '../../../test/mocks';
import { createImageScanEntityV2 } from '../scans/converter';
import { createPolicyEvaluationEntity } from './converter';

describe('#createPolicyEvaluationEntity', () => {
  test('should convert to entity', () => {
    expect(
      createPolicyEvaluationEntity(
        getMockPolicyEvaluation(),
        createImageScanEntityV2(getMockImageScanV2()),
      ),
    ).toMatchSnapshot();
  });
});
