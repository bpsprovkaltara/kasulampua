import test from 'node:test'
import assert from 'node:assert/strict'

import { buildPackageSearchFilterQuery } from './ckanPackageSearchFilters.js'

test('returns empty filter when no input is provided', () => {
  assert.equal(buildPackageSearchFilterQuery({}), '')
})

test('builds filter for group only', () => {
  assert.equal(
    buildPackageSearchFilterQuery({ group: 'sosial-ekonomi' }),
    'groups:"sosial-ekonomi"'
  )
})

test('builds filter for organization only', () => {
  assert.equal(
    buildPackageSearchFilterQuery({ organization: 'bps-provinsi-papua' }),
    'organization:"bps-provinsi-papua"'
  )
})

test('builds a single fq query when group and organization are both present', () => {
  assert.equal(
    buildPackageSearchFilterQuery({
      group: 'budaya',
      organization: 'bps-provinsi-gorontalo',
    }),
    'groups:"budaya" AND organization:"bps-provinsi-gorontalo"'
  )
})

test('escapes quotes and backslashes in filter values', () => {
  assert.equal(
    buildPackageSearchFilterQuery({
      group: 'budaya "kreatif"',
      organization: 'bps\\gorontalo',
    }),
    'groups:"budaya \\"kreatif\\"" AND organization:"bps\\\\gorontalo"'
  )
})
