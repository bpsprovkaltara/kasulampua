import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildPackageSearchFilterQuery,
  buildOrganizationFilterQuery,
} from './ckanPackageSearchFilters.js'

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

test('buildOrganizationFilterQuery returns empty for empty list', () => {
  assert.equal(buildOrganizationFilterQuery([]), '')
  assert.equal(buildOrganizationFilterQuery(null), '')
})

test('buildOrganizationFilterQuery single organization', () => {
  assert.equal(
    buildOrganizationFilterQuery(['bps-kalimantan-barat']),
    'organization:"bps-kalimantan-barat"'
  )
})

test('buildOrganizationFilterQuery ORs multiple organizations with escaping', () => {
  assert.equal(
    buildOrganizationFilterQuery(['bps-provinsi-papua', 'bps\\x']),
    'organization:("bps-provinsi-papua" OR "bps\\\\x")'
  )
})
