const { describe, it } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const rootDir = path.join(__dirname, '..')

describe('Apache 2.0 License Compliance', () => {
  describe('Root LICENSE file', () => {
    const licensePath = path.join(rootDir, 'LICENSE')
    assert.ok(fs.existsSync(licensePath), 'LICENSE file must exist in the root directory')
    const licenseContent = fs.readFileSync(licensePath, 'utf8')

    it('should contain the Apache License 2.0 title and version', () => {
      assert.ok(licenseContent.includes('Apache License'), 'LICENSE must specify Apache License')
      assert.ok(licenseContent.includes('Version 2.0, January 2004'), 'LICENSE must specify Version 2.0')
      assert.ok(licenseContent.includes('http://www.apache.org/licenses/'), 'LICENSE must contain Apache license URL')
    })

    it('should include all required 9 standard sections', () => {
      const requiredSections = [
        '1. Definitions.',
        '2. Grant of Copyright License.',
        '3. Grant of Patent License.',
        '4. Redistribution.',
        '5. Submission of Contributions.',
        '6. Trademarks.',
        '7. Disclaimer of Warranty.',
        '8. Limitation of Liability.',
        '9. Accepting Warranty or Additional Liability.'
      ]
      for (const section of requiredSections) {
        assert.ok(licenseContent.includes(section), `LICENSE must contain section "${section}"`)
      }
    })
  })

  describe('User-Facing License & Credits UI (license.html)', () => {
    const creditsPath = path.join(rootDir, 'license.html')

    it('license.html file should exist', () => {
      assert.ok(fs.existsSync(creditsPath), 'license.html must exist')
    })

    const creditsContent = fs.readFileSync(creditsPath, 'utf8')

    it('should include the required attribution notice for jules-task-archiver', () => {
      const requiredAttribution =
        'Portions of this software are based on jules-task-archiver, Copyright 2024 n24q02m.'
      assert.ok(
        creditsContent.includes(requiredAttribution),
        'license.html must include exact attribution statement: ' + requiredAttribution
      )
    })

    it('should include reference to upstream repository', () => {
      assert.ok(
        creditsContent.includes('https://github.com/n24q02m/jules-task-archiver'),
        'license.html should link to upstream repo'
      )
    })

    it('should include the full Apache 2.0 license text', () => {
      assert.ok(creditsContent.includes('Apache License'), 'Must contain Apache License title')
      assert.ok(creditsContent.includes('Version 2.0, January 2004'), 'Must contain Version 2.0')
      assert.ok(
        creditsContent.includes('TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION'),
        'Must contain terms and conditions header'
      )
      assert.ok(creditsContent.includes('END OF TERMS AND CONDITIONS'), 'Must contain end of terms and conditions')
    })
  })

  describe('Popup UI integration (popup.html & popup.css)', () => {
    const popupHtml = fs.readFileSync(path.join(rootDir, 'popup.html'), 'utf8')
    const popupCss = fs.readFileSync(path.join(rootDir, 'popup.css'), 'utf8')

    it('should contain a footer element', () => {
      assert.ok(popupHtml.includes('<footer>'), 'popup.html must contain a <footer> tag')
    })

    it('should contain a link to license.html that opens in a new tab', () => {
      assert.ok(
        /href=["']license\.html["']/.test(popupHtml),
        'popup.html must link to license.html'
      )
      assert.ok(
        /target=["']_blank["']/.test(popupHtml),
        'license link must have target="_blank"'
      )
      assert.ok(
        popupHtml.includes('License &amp; Credits') || popupHtml.includes('License & Credits'),
        'Link text must be License & Credits'
      )
    })

    it('popup.css should define footer styles', () => {
      assert.ok(popupCss.includes('footer {'), 'popup.css must contain footer rules')
      assert.ok(popupCss.includes('.footer-link'), 'popup.css must contain .footer-link rules')
    })
  })

  describe('Apache 2.0 Section 4b Modification Notices', () => {
    const modifiedFiles = [
      'background.js',
      'content.js',
      'main-world.js',
      'popup.js',
      'popup.css',
      'popup.html',
      'tests/background.test.js',
      'tests/content_extract.test.js',
      'tests/main-world.test.js',
      'tests/perf.test.js',
      'tests/popup.test.js'
    ]

    for (const file of modifiedFiles) {
      it(`${file} should contain a Section 4b modification notice at line 1`, () => {
        const filePath = path.join(rootDir, file)
        const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0]
        assert.ok(
          firstLine.includes('Modified by tommyzed:'),
          `${file} line 1 must include "Modified by tommyzed:", found: "${firstLine}"`
        )

        // Validate summary length is 3-6 words
        const match = firstLine.match(/Modified by tommyzed:\s*(.+?)(?:\s*\*\/|\s*-->)?$/)
        assert.ok(match, `${file} modification summary should be extractable`)
        const summary = match[1].trim()
        const wordCount = summary.split(/\s+/).length
        assert.ok(
          wordCount >= 3 && wordCount <= 6,
          `${file} summary "${summary}" has ${wordCount} words; expected between 3 and 6 words`
        )
      })
    }
  })
})
