/**
 * =============================================================================
 * FILE: src/vs/workbench/contrib/openagent/test/browser/routingEval.test.ts
 * PURPOSE: Golden eval harness for model-class → provider/profile routing.
 * OWNER: MoniGarr.com LLC
 * AUTHOR: Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC
 * CREATED: 2026-07-13
 * UPDATED: 2026-07-13
 * LICENSE: MIT (Open-Agent / MoniGarr.com LLC)
 *
 * USAGE:
 *   Run with the workbench browser unit-test harness targeting this file.
 *
 * RISK CLASS: R0
 *
 * TESTING:
 * - Golden fixtures for resolveRoute + privacy filter (VERIFY gate).
 * =============================================================================
 */

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { MODEL_CLASSES } from '../../common/modelClasses.js';
import { OPENAI_COMPATIBLE_PROFILE_IDS } from '../../common/profiles.js';
import { PROVIDER_IDS } from '../../common/providers.js';
import { DEFAULT_ROUTING_TABLE, filterFallbacksForPrivacy, resolveRoute } from '../../common/routingConfig.js';

suite('Open-Agent - routing eval harness', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const golden = [
		{
			modelClass: MODEL_CLASSES.localPrivate,
			expectProfile: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
			expectProvider: PROVIDER_IDS.openaiCompatible,
		},
		{
			modelClass: MODEL_CLASSES.embed,
			expectProfile: OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
			expectProvider: PROVIDER_IDS.openaiCompatible,
		},
		{
			modelClass: MODEL_CLASSES.codeSpecialist,
			expectProfile: OPENAI_COMPATIBLE_PROFILE_IDS.openai,
			expectProvider: PROVIDER_IDS.openaiCompatible,
		},
	] as const;

	for (const fixture of golden) {
		test(`routes ${fixture.modelClass} → ${fixture.expectProvider}:${fixture.expectProfile}`, () => {
			const resolved = resolveRoute(DEFAULT_ROUTING_TABLE, fixture.modelClass);
			assert.strictEqual(resolved.target.providerId, fixture.expectProvider);
			assert.strictEqual(resolved.target.profileId, fixture.expectProfile);
		});
	}

	test('privacy filter drops cloud fallbacks for local_private', () => {
		const candidates = [
			{ providerId: PROVIDER_IDS.openaiCompatible, profileId: OPENAI_COMPATIBLE_PROFILE_IDS.openai, providerModelId: 'gpt' },
			{ providerId: PROVIDER_IDS.openaiCompatible, profileId: OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio, providerModelId: 'local' },
			{ providerId: PROVIDER_IDS.openaiCompatible, profileId: OPENAI_COMPATIBLE_PROFILE_IDS.lmlink, providerModelId: 'mesh' },
			{ providerId: PROVIDER_IDS.openaiCompatible, profileId: OPENAI_COMPATIBLE_PROFILE_IDS.ollama, providerModelId: 'llama' },
		];
		const filtered = filterFallbacksForPrivacy(
			MODEL_CLASSES.localPrivate,
			candidates,
			DEFAULT_ROUTING_TABLE.constraints,
		);
		assert.deepStrictEqual(
			filtered.map(f => f.profileId),
			[
				OPENAI_COMPATIBLE_PROFILE_IDS.lmstudio,
				OPENAI_COMPATIBLE_PROFILE_IDS.lmlink,
				OPENAI_COMPATIBLE_PROFILE_IDS.ollama,
			],
		);
	});

	test('lmlink and kaggle profiles are registered', () => {
		assert.ok(OPENAI_COMPATIBLE_PROFILE_IDS.lmlink);
		assert.ok(OPENAI_COMPATIBLE_PROFILE_IDS.kaggleCompatible);
		assert.ok(OPENAI_COMPATIBLE_PROFILE_IDS.huggingfaceCompatible);
	});
});
