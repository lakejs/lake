## [0.3.10](https://github.com/lakejs/lake/compare/0.3.9...0.3.10) (2025-03-19)


### Bug Fixes

* **video:** cannot insert specified video using command ([30dd119](https://github.com/lakejs/lake/commit/30dd119e41f46ef2d86cd215948a7914bd801de9))
* **video:** jump to the cursor after resizing ([20575e1](https://github.com/lakejs/lake/commit/20575e1b4eb0717dae654a3bce170521f0817f02))


### Features

* **block-box:** add margin-bottom ([c901ae3](https://github.com/lakejs/lake/commit/c901ae3f85d896a9ce53dd9919cf427cb14aeffd))
* **plugins:** add twitter plugin ([7d4d8e5](https://github.com/lakejs/lake/commit/7d4d8e5cd3fc6c241de2861259135ab08016245f))
* **utils:** add createIframeBox function ([e744c86](https://github.com/lakejs/lake/commit/e744c861e65fb31d53d54300b3d7d1c4fbb9e2f8))
* **video:** show placeholder before video loaded ([627cb06](https://github.com/lakejs/lake/commit/627cb06cc0fe664e5ec939f3a5a75fd8060b151e))



## [0.3.9](https://github.com/lakejs/lake/compare/0.3.8...0.3.9) (2025-03-12)


### Bug Fixes

* **editor:** cannot focus on the end if the last child is a table or block box ([088167b](https://github.com/lakejs/lake/commit/088167b7f1ffa5e5b56326b61c9a9e5b73ee9cab))
* **list:** margin-bottom is inconsistent with other blocks ([01e4069](https://github.com/lakejs/lake/commit/01e406949969c98c8b3a53313e75f18ca1fac8b3))
* **video:** add multiple corner toolbars ([6fc32f6](https://github.com/lakejs/lake/commit/6fc32f6f66105756c074c6261f42997019a46630))



## [0.3.8](https://github.com/lakejs/lake/compare/0.3.7...0.3.8) (2025-03-06)


### Features

* **editor:** add contentRules to config ([20cf741](https://github.com/lakejs/lake/commit/20cf741fc555b8b95a2103d6f422f0ea2ff7b363))



## [0.3.7](https://github.com/lakejs/lake/compare/0.3.6...0.3.7) (2025-03-02)


### Bug Fixes

* **toolbar:** trigger selectedValues only when activeItems has items ([d0f6d4e](https://github.com/lakejs/lake/commit/d0f6d4e1c17876b061b41e3de1dc57c2b09140e1))



## [0.3.6](https://github.com/lakejs/lake/compare/0.3.5...0.3.6) (2025-03-02)


### Bug Fixes

* **toolbar:** should update state when initiating editor ([a1adac5](https://github.com/lakejs/lake/commit/a1adac546c1db3fb60922ce9a0734221320d3038))



## [0.3.5](https://github.com/lakejs/lake/compare/0.3.4...0.3.5) (2025-02-27)


### Features

* support dark theme ([5dae284](https://github.com/lakejs/lake/commit/5dae284e9bb7ead4d8c05bf66f21386dd484f706))
* **button:** set background from white to transparent ([26a97ca](https://github.com/lakejs/lake/commit/26a97ca346d820443c4635b882e240f5609b9e7a))
* **code-block:** add colors option ([84745bb](https://github.com/lakejs/lake/commit/84745bb222818aec28942ed68c2c00cd8b0daf24))
* **file:** add webp to requestTypes ([81f51d6](https://github.com/lakejs/lake/commit/81f51d602aa82f06ffa4a457186a43adf7a93b0a))
* **image:** add webp to requestTypes ([23a2c9d](https://github.com/lakejs/lake/commit/23a2c9dc0f5bea9cf9617b1b142b9e873b05e982))



## [0.3.4](https://github.com/lakejs/lake/compare/0.3.3...0.3.4) (2025-02-13)


### Bug Fixes

* **slash:** jump to the top or bottom when using the up or down key to change current item ([00828e2](https://github.com/lakejs/lake/commit/00828e23105ee495d7822e304d2afe545d809022))
* UI components support CSS selector or native DOM node ([61684ae](https://github.com/lakejs/lake/commit/61684aed2aad3b4b12c769bb812ad1dcdc46fb12))


### Features

* **editor:** remove box property from class ([d8390f2](https://github.com/lakejs/lake/commit/d8390f25943affd38b9a691491d937995de5457f))
* export commonly used types ([974a0d3](https://github.com/lakejs/lake/commit/974a0d31071d600c11aed63b53b64b08cee1f579))
* **utils:** export getBox function ([e50d177](https://github.com/lakejs/lake/commit/e50d177a9074069ca823a2a203881247d0f0b9c8))



## [0.3.3](https://github.com/lakejs/lake/compare/0.3.2...0.3.3) (2025-01-24)


### Bug Fixes

* **plugin:** allow overwriting existing plugins ([2884810](https://github.com/lakejs/lake/commit/2884810e07bf85f9fb32ee658d8c800a430f1dc6))



## [0.3.2](https://github.com/lakejs/lake/compare/0.3.1...0.3.2) (2025-01-23)


### Features

* **slash:** add alerts ([401df85](https://github.com/lakejs/lake/commit/401df85314ddb542a345967624568cd7f5ec05cd))



## [0.3.1](https://github.com/lakejs/lake/compare/0.3.0...0.3.1) (2024-12-26)


### Features

* **editor:** rename method from scrollToCaret to scrollToCursor ([6446309](https://github.com/lakejs/lake/commit/644630920fa856a5d8b52a3c0a1d7961e84e81de))



# [0.3.0](https://github.com/lakejs/lake/compare/0.2.6...0.3.0) (2024-12-17)


### Bug Fixes

* **dropdown:** should remove menu node ([4a8302c](https://github.com/lakejs/lake/commit/4a8302c11b75f5e28deb00fb074c45099be0385c))
* **floating-toolbar:** should adjust position ([cd837a4](https://github.com/lakejs/lake/commit/cd837a42266d61dccd5c4d48d226267059706350))
* **insert-box:** should create new block when there is no block ([cea7af6](https://github.com/lakejs/lake/commit/cea7af65e629e175a14915d2ed3e3846fae48ec8))
* **popup:** does not update position in document mode ([2f09148](https://github.com/lakejs/lake/commit/2f091488dfef3ca3373284b78f867cfb05f82d9d))
* **set-blocks:** should create a block when there is no content ([5091a9d](https://github.com/lakejs/lake/commit/5091a9dd7d9a7b86d2e604411f1b3e41584aa42d))
* **split-block:** should remove empty marks before appending a line break ([48dd538](https://github.com/lakejs/lake/commit/48dd538befcfb88a1a228789f1f8880b743e2015))

### Features

* **dropdown:** add menuCheck to config ([6f39929](https://github.com/lakejs/lake/commit/6f399295fff6696bd160594dec901834765741ac))
* **insert-fragment:** support string and Nodes ([041510e](https://github.com/lakejs/lake/commit/041510e9abd4de788d18de1640dbf809b60f760c))
* **is-visible:** return more detailed information ([083c7c5](https://github.com/lakejs/lake/commit/083c7c570e77a7cdbe65c0ccdcf4d987c1de8f62))
* **operations:** add insertBlock ([73e64e0](https://github.com/lakejs/lake/commit/73e64e0af3e04b30a904f033cbb48bdafb37d457))
* **selection:** remove insertNode ([fee70ef](https://github.com/lakejs/lake/commit/fee70efe132081ca33a60613e2e68dd857f14f2c))
* **slash:** add table to menu ([0f5edf0](https://github.com/lakejs/lake/commit/0f5edf0943e9613e959dcca925f7ac0ebf4aa21c))
* **plugins:** add table

### Performance Improvements

* **selection:** improve getAppliedItems method ([0445b88](https://github.com/lakejs/lake/commit/0445b88e4eb8e65ecd33f9607689cf782081286c))


### BREAKING CHANGES

* Functions in Utils are now exposed directly. Lake now only exposes three functions: query, template, and toHex.



## [0.2.6](https://github.com/lakejs/lake/compare/0.2.5...0.2.6) (2024-11-03)


### Bug Fixes

* **floating-toolbar:** should not wrap onto multiple lines ([fde5184](https://github.com/lakejs/lake/commit/fde51849ccc5b30e138ffeeaaaa46d68296d31f7))
* **image:** cannot resize image if original width is not set ([dcc70fb](https://github.com/lakejs/lake/commit/dcc70fb245be2ff0bea6344b77841f2d8e621af3))


### Features

* **image:** add caption ([39f11d3](https://github.com/lakejs/lake/commit/39f11d3f4cb50dc76514ce23ef1ce890f6110392))
* **box:** add corner-toolbar ([de1d016](https://github.com/lakejs/lake/commit/de1d01687848ef200a22388e8e81ed87d7ff89d2))
* **box:** add renderfloatingtoolbar event ([9537369](https://github.com/lakejs/lake/commit/95373693afb7277a83b8e5eda4ee92002c15f45b))
* **editor:** rename attribute from data-readonly to readonly ([323624c](https://github.com/lakejs/lake/commit/323624c256af3c5771fdf8da09b468d56c0e8e82))



## [0.2.5](https://github.com/lakejs/lake/compare/0.2.4...0.2.5) (2024-10-24)


### Bug Fixes

* **box:** jump to the start position when clicking floating toolbar ([06d2bb0](https://github.com/lakejs/lake/commit/06d2bb002d7443d038145ee186e2481bd8adf978))
* **box:** sometimes toolbar is generated repeatedly ([7d8bb4a](https://github.com/lakejs/lake/commit/7d8bb4a3effde144709b3337dae61a122f0fc19f))
* **i18n:** proofread ([4167028](https://github.com/lakejs/lake/commit/41670280432044279ae4dfa725c2bcc72c462acc))
* **image:** improve the icon displayed when an error occurs ([110a446](https://github.com/lakejs/lake/commit/110a446a45cb55a8d1c5597425b2131961e35060))
* **menu:** prevent line breaks in menu items ([e31f896](https://github.com/lakejs/lake/commit/e31f8962653a42bfad29377aaabfd2fbadbb241f))
* **menu:** should not show scrollbar when the popup menu reaches the bottom ([f2ad65a](https://github.com/lakejs/lake/commit/f2ad65a545a86604536c328cfafa290c49596df8))
* **popup:** should not add box shadow to icon button ([d9a6424](https://github.com/lakejs/lake/commit/d9a6424d1ae6b232acc99a4945759fc3af2cc3d2))


### Features

* **box-resizer:** add target to config; remove box from config ([cbb2968](https://github.com/lakejs/lake/commit/cbb2968795aca942e3187fe65f88127253adc680))
* **floating-toolbar:** add updateState method ([c64da30](https://github.com/lakejs/lake/commit/c64da302a45788acd1025b483cac1ab4869db869))
* **floating-toolbar:**  replace box property with range ([a110e14](https://github.com/lakejs/lake/commit/a110e14746bb05671267eaf5daa42cb7479ed2a3))
* **floating-toolbar:** extend toolbar ([fc13920](https://github.com/lakejs/lake/commit/fc13920f488b7061988176daace907842363b499))
* **floating-toolbar:** rename config.range to config.target; support node type ([20ff903](https://github.com/lakejs/lake/commit/20ff903c6b75ea4b4030e0aa4d146d127e60f35c))
* **image:** add toolbar for box ([2178be2](https://github.com/lakejs/lake/commit/2178be2bda63d607c3c662956996709156ec8aca))
* **isVisible:** rename function from nodePosition to isVisible ([8bd2d89](https://github.com/lakejs/lake/commit/8bd2d89f785b62ce5d80690a865c325e3356631a))
* **isVisible:** support range ([d5d16c9](https://github.com/lakejs/lake/commit/d5d16c90e34186b2abf25ee5bd3e62eec60a2cf3))



## [0.2.4](https://github.com/lakejs/lake/compare/0.2.3...0.2.4) (2024-10-02)


### Bug Fixes

* **add-mark:** get incorrect result when there is an empty span tag containing other marks ([25fec3c](https://github.com/lakejs/lake/commit/25fec3cb765f1c216fab3bce94ae5fd8e4b6a120))
* **add-mark:** should not remove another empty mark when the range is collapsed ([230e704](https://github.com/lakejs/lake/commit/230e7040bf184d4a6fda9af0a2959c2f746cce25))
* **menu:** improve style ([47a84d3](https://github.com/lakejs/lake/commit/47a84d34e4af11a5033c0b5245555761562fb965))
* **popup:** increase z-index for popup ([e0468e1](https://github.com/lakejs/lake/commit/e0468e188e541e08d461305c5a0224614f1fd450))
* **remove-mark:** should not remove another mark when the range is collapsed ([3c9a2d2](https://github.com/lakejs/lake/commit/3c9a2d2341da648de4a4d95cbf2da9bc8b3c4bf3))
* **slash:** improve style ([9ab3876](https://github.com/lakejs/lake/commit/9ab387689ef7aa11d6dcf6f60bac51f60bf384c9))


### Features

* **css:** change custom properties from local to global ([2bd2b20](https://github.com/lakejs/lake/commit/2bd2b20618ba849b4b57ce0a1959cbd77c31db93))



## [0.2.3](https://github.com/lakejs/lake/compare/0.2.2...0.2.3) (2024-09-30)


### Bug Fixes

* **dropdown:** improve CSS selector to prevent it from being overridden by other rules ([40bdd3d](https://github.com/lakejs/lake/commit/40bdd3d522b961757cc3ff1729918793d2f8f251))



## [0.2.2](https://github.com/lakejs/lake/compare/0.2.1...0.2.2) (2024-09-30)


### Bug Fixes

* **box-toolbar:** have incorrect position when resizing window ([ced52dd](https://github.com/lakejs/lake/commit/ced52dd019779c34c7faa5de84ff5d2f4777dfcd))
* **code-block:** the width should not be fixed ([9202284](https://github.com/lakejs/lake/commit/9202284b735f7331ddcebda52a2c4822e1179c42))
* **image:** box should not render after it has been removed ([bd3310a](https://github.com/lakejs/lake/commit/bd3310a86cc5ecb58fe0291d51dce0ec11197664))
* **insertBox:** should remove marks before inserting an inline box ([0190a56](https://github.com/lakejs/lake/commit/0190a56371133fa650c2abbc50722fb25a0d203a))
* **nodes:** closestContainer does not support text node ([d55aae4](https://github.com/lakejs/lake/commit/d55aae461df955ac81558eeed2f2e660413ce7f2))
* **slash:** should pass locale to menu ([192209b](https://github.com/lakejs/lake/commit/192209bf440abf508175c572c5714753e7be4bf0))


### Features

* **box-toolbar:** remove root property from config ([ae86f45](https://github.com/lakejs/lake/commit/ae86f45cfc2fdb3e8074c12211e4bd8065ea04ff))
* **dropdown:** menu can be added to document body by location config ([f69fe86](https://github.com/lakejs/lake/commit/f69fe8643326eb34922e14d2b9b9ded12d4a9d64))
* **dropdown:** rename config from placement to direction ([c4ec524](https://github.com/lakejs/lake/commit/c4ec52486ae0fd84d48a1371ad9dda8b9f683ac0))
* **editor:** remove popupContainer property ([558bf6f](https://github.com/lakejs/lake/commit/558bf6f4e196f1947e2b383b51e3e7438810a78c))
* **editor:** remove resize and scroll events ([7a3d2ba](https://github.com/lakejs/lake/commit/7a3d2bafdc5fc292c73d0ae2002f6ef3aa6958ee))
* **link-popup:** remove root property from config; add onShow  and onHide to config ([b51b984](https://github.com/lakejs/lake/commit/b51b984c12334b7f6960bd22f4941e938f686951))
* **mention:** add plugin ([9d74d3c](https://github.com/lakejs/lake/commit/9d74d3c43558a92b13e26b9a154acf5fcd421b50))
* **menu:** add menu class ([f046735](https://github.com/lakejs/lake/commit/f0467351ea0a776274768c9db1de5ecc5f17ef28))
* **range:** add getCharacterRange method ([c00a0df](https://github.com/lakejs/lake/commit/c00a0dfa1c9ce46f95049721f5fd458fcc6d1ae1))


### Performance Improvements

* **dropdown:** create menu when clicking dropdown ([60759ad](https://github.com/lakejs/lake/commit/60759adc4055f21e0eadb7758071bcb69f0f3657))



## [0.2.1](https://github.com/lakejs/lake/compare/0.2.0...0.2.1) (2024-09-13)


### Bug Fixes

* **box:** cannot deselect a selected box when clicking outside the editor ([e1fde85](https://github.com/lakejs/lake/commit/e1fde8521ac47925bc91f5b2c35e5c42662f9eb1))
* **box:** cannot select a box when current selection is outside the editor ([2036cee](https://github.com/lakejs/lake/commit/2036ceef3e1330b8293d898ac3474bf9d6d4ed58))
* **scroll:** should be aligned to the nearest edge of the visible area ([bad77de](https://github.com/lakejs/lake/commit/bad77dea20773a059712156d69383c90c99dcc1e))



# [0.2.0](https://github.com/lakejs/lake/compare/0.1.25...0.2.0) (2024-09-11)


### Bug Fixes

* **backspace:** empty tags before the caret cannot be removed ([141a384](https://github.com/lakejs/lake/commit/141a384277e0160e41c6cdacd91164fc1396e257))
* **slash:** the popup's direction should not be changed while searching items ([fc24489](https://github.com/lakejs/lake/commit/fc24489c3923e6513210c3c65e67c7b8f0974604))
* **upload:** choosing the same file does not trigger change event ([ba11177](https://github.com/lakejs/lake/commit/ba111777b59b8c4b329428ac25255ab4379116c9))


### Features

* **equation:** add help icon ([bad6ed8](https://github.com/lakejs/lake/commit/bad6ed8714aaeef71195551ea6ea6a21598185ae))



## [0.1.25](https://github.com/lakejs/lake/compare/0.1.24...0.1.25) (2024-09-07)


### Bug Fixes

* **equation:** improve words ([130ef06](https://github.com/lakejs/lake/commit/130ef066ca3a9d6edfeec7e828e9516c9b8dce51))



## [0.1.24](https://github.com/lakejs/lake/compare/0.1.23...0.1.24) (2024-09-05)


### Bug Fixes

* **selection:** if the range is outside, the native selection should not be updated ([b2097f8](https://github.com/lakejs/lake/commit/b2097f8761349bee5dc5e447986eac09e72710db))



## [0.1.23](https://github.com/lakejs/lake/compare/0.1.22...0.1.23) (2024-09-04)


### Bug Fixes

* **box resizer:** test case throws an exception on Firefox ([44980ce](https://github.com/lakejs/lake/commit/44980cec1e9f6ee17e0cbddcd340938dce95e826))
* **box toolbar:** improve unmount method ([a15b1a2](https://github.com/lakejs/lake/commit/a15b1a2980143c8ae32694b83f53c1b788867abd))
* **box toolbar:** lake-custom-properties class is removed when hiding the toolbar of the box. ([5da1d9f](https://github.com/lakejs/lake/commit/5da1d9fd10ebdcf85e82acb17be36a0cf1e39532))
* **code block:** event listener of dropdown not removed when unmounting editor ([2fa3e0d](https://github.com/lakejs/lake/commit/2fa3e0db36c88b11bb115a8cd3e15a80b4d64d5d))
* **editor:** copy, cut and paste events are triggered when the current selected range is not within the editor ([2551fb3](https://github.com/lakejs/lake/commit/2551fb3b20d86df69b33821680311bf3b26a0cbb))
* **editor:** event listeners are not removed when unmounting ([0bdd330](https://github.com/lakejs/lake/commit/0bdd33068640ac4a32a035ff31bd2402e3cd0fa6))
* **editor:** should clear debounce functions when unmounting editor ([5bc428d](https://github.com/lakejs/lake/commit/5bc428d38db05af0ff1110e2dac8b5d84aa424b7))
* **editor:** toolbar not removed when removing editor ([37c987f](https://github.com/lakejs/lake/commit/37c987f95925c639b4971fa6b71bca5ff4114fc2))
* **equation:** cannot hide textarea form after a new equation is inserted ([4a3e65d](https://github.com/lakejs/lake/commit/4a3e65d79f7be835f91dd825d00bac07fcbbdae1))
* **link:** focus on the end of the link after finishing link editing. ([911da02](https://github.com/lakejs/lake/commit/911da02d2fab3dbe0dac1f0a62df674212c40b5b))
* **link:** while popup for link is open, box cannot be selected when clicking on it ([542e581](https://github.com/lakejs/lake/commit/542e581718c66ddd23ee0639670abbab4fb8d966))
* **toolbar:** event listener of dropdown not removed when unmounting toolbar ([d1709ab](https://github.com/lakejs/lake/commit/d1709ab5d53ba2f0b515930fc30250241134f9bb))
* **toolbar:** should not update state after the toolbar is removed ([844b9d5](https://github.com/lakejs/lake/commit/844b9d52bb124786a9693a1fd29a196f6482b773))


### Features

* **box:** getEditor method always returns an editor object ([b7b6a7f](https://github.com/lakejs/lake/commit/b7b6a7f1b480bdf82d6a977c79183f7e118fae41))
* **box:** set vertical alignment of inline box to middle ([5d43eff](https://github.com/lakejs/lake/commit/5d43effd78831d6e52e5d958165d8e0a8e225397))
* **editor:** add scroll event ([55d8813](https://github.com/lakejs/lake/commit/55d8813e148266ef39513c5047b78fc7e5141dda))
* **editor:** support excluding specific plugins ([54a8e2c](https://github.com/lakejs/lake/commit/54a8e2c58e39774552dde98855d652266a546459))
* **editor:** rename method from updatePosition to position ([668a689](https://github.com/lakejs/lake/commit/668a6890d9ce6e8743cdeb1e47c08468ec32b968))
* **editor:** enable a plugin by setting its config to true ([b27acc5](https://github.com/lakejs/lake/commit/b27acc50eb8126e7e09ef67a26675da2b38b66f2))
* **equation:** set focus on the textarea after inserting an equation ([d2e61e1](https://github.com/lakejs/lake/commit/d2e61e1358b54c8884970bfed1a45d7a8a4aee73))
* **keystroke:** remove alias ([57da2f4](https://github.com/lakejs/lake/commit/57da2f4e7ac548f0b9198be74284739cbd6a59f9))
* **nodes:** add value method ([2d79dd0](https://github.com/lakejs/lake/commit/2d79dd079932a53a2521396fc00cd64ef823373f))
* **plugin:** return unmount function ([22df5a5](https://github.com/lakejs/lake/commit/22df5a5b26967ce3260aeae1acaf65cd4f4d9008))
* **plugin:** use name to identify specific plugins ([770870a](https://github.com/lakejs/lake/commit/770870abbe07d86288a7fb8e82fd65f5edd45000))
* **plugin:** add slash shortcut ([14d4f11](https://github.com/lakejs/lake/commit/14d4f118d5f4b3f198bf32a8f054f32609062487))
* **utils:** add scrollToNode function ([583484c](https://github.com/lakejs/lake/commit/583484cbed7b416ffacb510e39139c7858f001fa))
* **utils:** rename function from nodeAndView to nodePosition ([6824548](https://github.com/lakejs/lake/commit/6824548c5447e70c3370d4117b85347adc9fe8e1))



## [0.1.22](https://github.com/lakejs/lake/compare/0.1.21...0.1.22) (2024-07-16)


### Bug Fixes

* **code block:** backspace key deletes code block when all code is selected ([d4c24bf](https://github.com/lakejs/lake/commit/d4c24bf373d694d164a11a0b2afcfe9bb791eb53))
* **code block:** poor performance when typing rapidly ([2af8052](https://github.com/lakejs/lake/commit/2af80527bca740ff9dca542badc65288cc451532))
* **editor:** caret position is sometimes incorrect ([b0c4d9d](https://github.com/lakejs/lake/commit/b0c4d9d6257b109490a01e7ad5bbf5661d8c8d1f))
* **editor:** poor performance when typing rapidly ([017560d](https://github.com/lakejs/lake/commit/017560d4f52a8c960a9599b17132cd2261427920))


### Features

* **editor:** remove input event ([0c65a51](https://github.com/lakejs/lake/commit/0c65a51d2ba19c519d933f71e9fc6d5efc7a6374))



## [0.1.21](https://github.com/lakejs/lake/compare/0.1.20...0.1.21) (2024-07-13)


### Bug Fixes

* **selection:** current selection will be changed when clicking outside the container ([1869d65](https://github.com/lakejs/lake/commit/1869d65e7c7d3e1e0abc7c56585191d5d12a04a3))
* **toolbar:** new content should be inserted at the end of the editor when toolbar buttons are clicked ([9ae3158](https://github.com/lakejs/lake/commit/9ae3158fa810380b810638e315dc9ab66838feea))


### Features

* **nodes:** add contains method ([2834af4](https://github.com/lakejs/lake/commit/2834af4d137cf2a8c3724ffb59d149a86ce9107b))



## [0.1.20](https://github.com/lakejs/lake/compare/0.1.19...0.1.20) (2024-07-11)


### Bug Fixes

* **editor:** throw an error when rendering multiple editors ([daeb6a9](https://github.com/lakejs/lake/commit/daeb6a933167b5dd0b346d66ce9b64bc0ee914be))



## [0.1.19](https://github.com/lakejs/lake/compare/0.1.18...0.1.19) (2024-07-10)


### Bug Fixes

* **box:** display incorrect text when inputting text at the start or end of an inline box in composition mode ([89c0c7b](https://github.com/lakejs/lake/commit/89c0c7b0f799b7855159eb7a4e7df3fe251e45b2))
* **HTMLParser:** class attribute does not support multiple values ([3cce249](https://github.com/lakejs/lake/commit/3cce249015ec3204398810db74752d0b35840eb9))
* **range:** getRect method returns incorrect value with empty text node ([8d53728](https://github.com/lakejs/lake/commit/8d53728fa86c28202353e776e83e99597543e632))


### Features

* **range:** add adjustBr method ([82d7053](https://github.com/lakejs/lake/commit/82d7053dc3146379a9d4e3d1a08c163b73ae1bf8))
* **range:** improve shrinkAfter method ([5bbb2b4](https://github.com/lakejs/lake/commit/5bbb2b4b6735f2f6d830063b921d8454b40a2e50))
* **utils:** add appendBreak function ([1a5deca](https://github.com/lakejs/lake/commit/1a5deca319e4934400c702a6d3d675cf6d7624c7))
* **utils:** remove appendDeepest function ([2d8d83b](https://github.com/lakejs/lake/commit/2d8d83b986f403d11142482a227bb3a2db9fd337))
* **utils:** rename function from getDeepest to getDeepElement ([87379c9](https://github.com/lakejs/lake/commit/87379c989a1389fd6e3c8921936cc34b13b93549))
* **utils:** rename function from removeBr to removeBreak ([6be718f](https://github.com/lakejs/lake/commit/6be718f7c3750bc3a3ed9e44acb14aab20dcab8d))



## [0.1.18](https://github.com/lakejs/lake/compare/0.1.17...0.1.18) (2024-07-06)


### Bug Fixes

* **backspace:** br should not be merged into non-paragraph blocks ([f8c9fff](https://github.com/lakejs/lake/commit/f8c9fff727f0f4a1faccdebcdf028048f33cb32f))
* **keystroke:** hotkeys should not be triggered in composition mode ([f96aa47](https://github.com/lakejs/lake/commit/f96aa4763078e448fc7fd15fdf57a50ec44277b4))
* **nodes:** isEmpty method incorrectly returns true if a block contains multiple br nodes ([5480e7f](https://github.com/lakejs/lake/commit/5480e7f20440077044266b6952ef511e6f297e97))



## [0.1.17](https://github.com/lakejs/lake/compare/0.1.16...0.1.17) (2024-07-04)


### Bug Fixes

* **backspace:** unable to remove the first br node ([c318240](https://github.com/lakejs/lake/commit/c318240afa8556ae931b285757e2ad0ef92cb867))
* **history:** doesn't re-render boxes with updated attributes when undoing or redoing ([396aca7](https://github.com/lakejs/lake/commit/396aca73df4c7525b1d421dde62c8fe8d0521ca5))
* **editor:** placeholder is not removed when inserting composition text ([7fa391a](https://github.com/lakejs/lake/commit/7fa391a58bdfb3329d738441150550e86ac64460))
* **editor:** prevent displaying duplicated contents when re-rendering a box ([164dfe7](https://github.com/lakejs/lake/commit/164dfe753770229842253a120dd8cbdc1f8c7e93))
* **range:** getRect throws an error with empty text node ([23bec1a](https://github.com/lakejs/lake/commit/23bec1af274285045e222c74b6da5dbf89b3fe12))
* **editor:** uncompleted text is inserted in composition mode ([3c63151](https://github.com/lakejs/lake/commit/3c63151c4b81b374e26cbdfcd2b6ad4bf06c14f5))
* **editor:** when the caret is positioned behind a br tag, the input event is triggered twice ([936121d](https://github.com/lakejs/lake/commit/936121df0cc05fa3ffe04d0f856d1827508cf555))


### Features

* **plugin:** add equation ([40e8402](https://github.com/lakejs/lake/commit/40e8402776fe973df6053d147cec23da6bb958ab))
* **plugin:** add special character ([a8906c8](https://github.com/lakejs/lake/commit/a8906c8e2e806af3be1e4019832d57e553725af4))
* **editor:** disable undo and redo buttons when there is no data to do ([e179d4d](https://github.com/lakejs/lake/commit/e179d4d160bee868a4f6ee6b667df81a99faec8a))
* **HTMLParser:** remove getNodeList method ([8baf5cb](https://github.com/lakejs/lake/commit/8baf5cbe641399121d94b9625955c028f9214d62))
* **keystroke:** replace tinykeys with is-hotkey ([39531b6](https://github.com/lakejs/lake/commit/39531b6949b384b1ef1e01fc42fd3022163f2f0c))
* **editor:** rename method from debug to info ([4cbc103](https://github.com/lakejs/lake/commit/4cbc103149470a08a181a4dd6b155234397ad0c3))



## [0.1.16](https://github.com/lakejs/lake/compare/0.1.15...0.1.16) (2024-06-21)


### Bug Fixes

* **box:** immediately update the classes after selection changed ([11a9191](https://github.com/lakejs/lake/commit/11a9191d7d40b7fd885f449b9ac0bfff9ab09f9c))
* **code block:** scroll to the top after selecting language ([05e05d4](https://github.com/lakejs/lake/commit/05e05d4d0265c0bc474495b2b116c3f0eebb3c5a))
* **dropdown:** no hovered effect ([dc78458](https://github.com/lakejs/lake/commit/dc784586ad004acfd1f9cd449d18cf528a0fe845))


### Features

* **dropdown:** support character ([217b422](https://github.com/lakejs/lake/commit/217b42208ce14ce0b1c949ce8f143a1ddb032114))
* **utils:** use native functions to encode or decode base64 ([009fa6f](https://github.com/lakejs/lake/commit/009fa6fc56481a1c6941f8d3fe4e31796ab09e2e))



## [0.1.15](https://github.com/lakejs/lake/compare/0.1.14...0.1.15) (2024-06-15)


### Bug Fixes

* **setBlocks:** indent attribute should not be added ([e89fc5a](https://github.com/lakejs/lake/commit/e89fc5abbf41755f05a330637d62626663bd1837))
* **upload:** ensure XHR in uploading status is always canceled when removing box ([d3716b0](https://github.com/lakejs/lake/commit/d3716b01933e90fbc012ce6a43b6b5c4f551a394))


### Features

* **plugin:** add emoji ([86efe76](https://github.com/lakejs/lake/commit/86efe76062d7ef72263e4ac33dcb2e8dbc64c9ff))
* **dropdown:** menu supports icon type ([758fc27](https://github.com/lakejs/lake/commit/758fc2765b103b27892a6a69fcb344e38c281679))
* **editor:** add historySize ([0b38265](https://github.com/lakejs/lake/commit/0b382658b84ac0118a4b4c55f479e8a4298e20ab))
* **editor:** remove boxselectionstylechange event ([ad35549](https://github.com/lakejs/lake/commit/ad3554970c3b931432817d412b2f2ca148298e42))
* **editor:** export insertBox and removeBox ([ba8e075](https://github.com/lakejs/lake/commit/ba8e075bd89ab8f1e5f6fcce03126aaa6d87543f))
* **editor:** insertContents removed ([6c9744a](https://github.com/lakejs/lake/commit/6c9744aa45222376acf6b3c637c41feac267e159))
* **editor:** some methods support the first node only ([c1f1a97](https://github.com/lakejs/lake/commit/c1f1a97bc7ab418c5ee53ed7044bee0c55d470ee))



## [0.1.14](https://github.com/lakejs/lake/compare/0.1.13...0.1.14) (2024-06-03)


### Bug Fixes

* **backspace:** empty code block should be removed ([120645a](https://github.com/lakejs/lake/commit/120645afb860af24650a9e56a7fc0ab8ba7f4717))
* **backspace:** after deleting the last character inside a mark, br should not be added ([7f0a51e](https://github.com/lakejs/lake/commit/7f0a51e818de693b7cf4919df0d9761c7b85b5e0))
* **backspace:** should remove empty marks when merging two blocks ([b0d50cb](https://github.com/lakejs/lake/commit/b0d50cb7c72fd5b835531213c921664f35a45953))
* **editor:** history not saved after fixing incorrect content ([a2df268](https://github.com/lakejs/lake/commit/a2df268998ab56daa25ee5346f04ae030ae68354))
* **history:** index is incorrect when undoing ([0f008ec](https://github.com/lakejs/lake/commit/0f008ec0b939fee7fe8f4a1245e4cfe2e8f43d60))
* **history:** sometimes cannot undo ([3441f5f](https://github.com/lakejs/lake/commit/3441f5ffab51b610363ea94b139f201dc00658a9))
* **markdown:** history should not be saved after executing a command ([db2e322](https://github.com/lakejs/lake/commit/db2e3229776aeac14cd8beafcd4972b03c5511fc))
* **editor:** minChangeSize config does not work ([b3aaa9a](https://github.com/lakejs/lake/commit/b3aaa9ac4806a44abb4ad83ca96bbde2a12a9d14))
* **editor:** scrolling to wrong position when deleting text with an empty text node ([3ed1d87](https://github.com/lakejs/lake/commit/3ed1d871bccacfddf48bf8ab0b9edd96c816093f))
* **editor:** should avoid changing the DOM tree when getting value ([8e450b5](https://github.com/lakejs/lake/commit/8e450b5ba50f395a549df5318e24b46c334b23a3))
* **editor:** the editor sometimes loses the caret ([6a5f218](https://github.com/lakejs/lake/commit/6a5f21874b53ca202d6f0f499bc42627c43c29af))
* **toBookmark:** zero width space should not be removed ([1e4c1d2](https://github.com/lakejs/lake/commit/1e4c1d2458335149393964824f163e18a6d35cf5))
* **editor:** unsaved input data isn't reset after the length reaches minChangeSize ([c7c3c0e](https://github.com/lakejs/lake/commit/c7c3c0ebb7619c04eca8bcdf582add456dbe8439))
* **editor:** value of change event is incorrect after fixing incorrect content ([4c5e1be](https://github.com/lakejs/lake/commit/4c5e1bebed53e0b71146065262aa64c7dec5a0bb))


### Features

* **editor:** remove  prepareOperation and commitOperation methods ([9187f25](https://github.com/lakejs/lake/commit/9187f25bfcf63e22a51639da8efb629a3e76a6cc))
* **history:** change accessibility of list and index from private to public ([2bc2ab3](https://github.com/lakejs/lake/commit/2bc2ab3487cfabf69d82e77623dc8b35036fcced))



## [0.1.13](https://github.com/lakejs/lake/compare/0.1.12...0.1.13) (2024-05-27)


### Bug Fixes

* **copy and cut:** adjust the selection when multiple boxes are selected ([c38aad0](https://github.com/lakejs/lake/commit/c38aad0f1b24cc8df5f708e990d3cfafc9f98356))
* **copy and cut:** improve adjusting; rename methods from adapt to adjust ([534d675](https://github.com/lakejs/lake/commit/534d67560c42b42fa09a47c45032e3168b00b772))
* **file:** wrong style in headings ([175b284](https://github.com/lakejs/lake/commit/175b284c1497df5a5c050f86518e7147d23a93ba))
* **history:** sometimes the index is not subtracted when undoing ([c3cdb19](https://github.com/lakejs/lake/commit/c3cdb19490c9416ee60af58d6152de115f66210c))
* incorrect content generated when copying or cutting ([a16e195](https://github.com/lakejs/lake/commit/a16e195d287ba67c04e337b25b1ce3a979db228d))
* **paste:** inline box not rendered after copy and paste ([47f99a4](https://github.com/lakejs/lake/commit/47f99a42e86ef759f04247b121b570195ad5eb9a))
* **paste:** throw an error when pasting multiple inline boxes into empty block ([12511ff](https://github.com/lakejs/lake/commit/12511ff5ccf6f6dd01ec482c7171304012994c0f))
* **video:** styling issue in headings ([c9abd3e](https://github.com/lakejs/lake/commit/c9abd3e15a4af94331b11fff4707781927987990))
* **editor:**  when there are multiple editors, the focus jumps to the wrong position after inserting content ([193c92a](https://github.com/lakejs/lake/commit/193c92adc8876a97860ffcd159a4647a9ae15df4))


### Features

* **editor:** move box instance methods to the editor class ([a5ae9e7](https://github.com/lakejs/lake/commit/a5ae9e7d0aa5724b6d69e5c425d6cad53d1c3d76))



## [0.1.12](https://github.com/lakejs/lake/compare/0.1.11...0.1.12) (2024-05-21)


### Bug Fixes

* **box toolbar:** unable to display divider ([02fbbbe](https://github.com/lakejs/lake/commit/02fbbbeb83467de187bc80b749678e6566a16e12))
* **box:** should not display boxes in undone status ([89dab49](https://github.com/lakejs/lake/commit/89dab493693544bda8f168aa79127ce928640b51))
* **getBox:** should save all instances ([dbdc642](https://github.com/lakejs/lake/commit/dbdc642da5e577125adb85ece7fc8dedad52677a))
* **image:** throw an error after removing an image before it finishes loading ([33595b2](https://github.com/lakejs/lake/commit/33595b2a4c8f3c7ec0f95b418179522fa5dcf795))
* **readonly:** cannot select code or filename ([6d73990](https://github.com/lakejs/lake/commit/6d7399031c765e6eb8386ac560efbb36718556be))


### Features

* **box:** add beforeunmount event; remove useEffect method ([7bf8411](https://github.com/lakejs/lake/commit/7bf84116fd50edafae218851e03152c27b1df29b))
* **box:** add setToolbar method ([5c1ab5f](https://github.com/lakejs/lake/commit/5c1ab5f5dd5f8c0ea071cfbef3fcf9dd0b0f2266))
* **link:** support saving by pressing enter key ([53b3b83](https://github.com/lakejs/lake/commit/53b3b8369063fdee9ffd9ef70f6e4a58e52532d4))
* **plugin:** add video



## [0.1.11](https://github.com/lakejs/lake/compare/0.1.10...0.1.11) (2024-05-17)


### Bug Fixes

* **backspace key:** produce unexpected br with inline box ([9925db3](https://github.com/lakejs/lake/commit/9925db392e1810ffec6c1aac278e4a4d675e091c))
* **file:** unexpected activation before focusing on the box when clicking ([63d359e](https://github.com/lakejs/lake/commit/63d359e3d9b3a890097f6ee7b157150a4165879e))
* **list:** cannot change a numbered list that includes an inline box to another list ([77426bc](https://github.com/lakejs/lake/commit/77426bc3a1014797f0f1b430dd7ecd0fff0937ec))



## [0.1.10](https://github.com/lakejs/lake/compare/0.1.9...0.1.10) (2024-05-16)


### Bug Fixes

* **nodeAndView:** sometimes returns wrong value ([2b08afc](https://github.com/lakejs/lake/commit/2b08afc632e183afd3a57ab3dbc1ec6de0b804b5))



## [0.1.9](https://github.com/lakejs/lake/compare/0.1.8...0.1.9) (2024-05-16)


### Bug Fixes

* **nodeAndView:** returns an incorrect top value when the page has a scrollbar ([a5c926e](https://github.com/lakejs/lake/commit/a5c926e39fca39c106961932d758dd027c874f07))


### Features

* **box:** add toolbar for box ([054b8ce](https://github.com/lakejs/lake/commit/054b8ce1b192b64bf12aede182b342b0bc196f4e))
* **box:** getBox supports boxName ([1ba5162](https://github.com/lakejs/lake/commit/1ba516221727b672212acef9e4456ce987e60fff))
* **editor:** add selectBox method ([669b135](https://github.com/lakejs/lake/commit/669b1357e8ba94b29aaea628837e21bb0958e4cc))
* **editor:** enhance removeBox method ([7f78eb5](https://github.com/lakejs/lake/commit/7f78eb5cc46c87a2c510ba2245ca90d9c8149799))
* **plugin:** add file ([c2e229e](https://github.com/lakejs/lake/commit/c2e229e6b301e2fc184dca14010ded5211deed3d))
* **utils:** add nodeAndView ([efc45f9](https://github.com/lakejs/lake/commit/efc45f988d2ccaac74abd3fa736161e2f26aa8c1))



## [0.1.8](https://github.com/lakejs/lake/compare/0.1.7...0.1.8) (2024-05-10)


### Bug Fixes

* **editor:** cannot copy or cut a box ([c4106ad](https://github.com/lakejs/lake/commit/c4106ad57ba9554642fa5d831b60f1eb37825a1c))
* **editor:** does not scroll to caret after inputting text outside viewport ([4592977](https://github.com/lakejs/lake/commit/45929774f2f4c49c48dec677d4f86f3359f6ea29))
* **editor:** scrollToCaret is not working when overflow is visible. ([4207100](https://github.com/lakejs/lake/commit/42071005666a3619e35b339a06995cea62894fe6))
* **image:** cannot resize image ([21a0202](https://github.com/lakejs/lake/commit/21a0202a999c7c84a9c02d1661fd112f47bb864a))
* **image:** lose focus when zooming in the iOS ([bdc9a13](https://github.com/lakejs/lake/commit/bdc9a13d62471a1d75bc4adf0609cf96d5a37b58))
* **paste:** cannot paste when selecting a box ([86b0d19](https://github.com/lakejs/lake/commit/86b0d1979fbcba737859442091c6d33c96e18d95))


### Features

* **drop:** support dropping a file from outside ([797d8b2](https://github.com/lakejs/lake/commit/797d8b28c0997d5de924edcd03cc118483f82014))
* **drop:** show indication rod when dragging ([22a832f](https://github.com/lakejs/lake/commit/22a832fd8000f99d5ccf81789237c9f034c41466))
* **selection:** add scrollIntoView method ([177cf79](https://github.com/lakejs/lake/commit/177cf7973de4b7035fe235c5fa503200894cc4b6))
* **box:** support drag-and-drop feature used to moving a block or a box ([e2c1064](https://github.com/lakejs/lake/commit/e2c1064026e38035326ae2e7f0f8f957f88ef5e8))



## [0.1.7](https://github.com/lakejs/lake/compare/0.1.6...0.1.7) (2024-05-01)


### Bug Fixes

* **markdown:** should not make code block when inputting less than three backtick characters ([c6d3e23](https://github.com/lakejs/lake/commit/c6d3e23bc971c60153823b83ef6c8e619df2a810))
* **toolbar:** dropdown should use the center point to determine displaying direction ([5094a06](https://github.com/lakejs/lake/commit/5094a062059398ed084382d3c4c6d454b4ce5b30))


### Features

* **toolbar:** toolbar can be placed at the bottom of the content ([d16076e](https://github.com/lakejs/lake/commit/d16076e2ce176cf676e82b6eb20e3d64a99f2889))



## [0.1.6](https://github.com/lakejs/lake/compare/0.1.5...0.1.6) (2024-04-30)


### Bug Fixes

* **code block:** dropdown menu is not fully visible ([5498b92](https://github.com/lakejs/lake/commit/5498b92d77927cf9b3a16e3fd910db24b369858f))
* **editor:** should remove all events after unmounting editor ([342736d](https://github.com/lakejs/lake/commit/342736d3fc3201d35d25c9ed4212f4179e180c3e))
* **editor:** should remove all listeners when unmounting ([6a0b4d2](https://github.com/lakejs/lake/commit/6a0b4d258c618f743a4e0b24d71641992626fc72))


### Features

* **editor:** add placeholder ([a8998f5](https://github.com/lakejs/lake/commit/a8998f58812a2e888df860f89b14bce1f98f4cb8))



## [0.1.5](https://github.com/lakejs/lake/compare/0.1.4...0.1.5) (2024-04-28)


### Bug Fixes

* **deleteContents:** when deleting after selecting all, an invalid empty table may be left. ([61fcb12](https://github.com/lakejs/lake/commit/61fcb12b51b24c2747e90c496efefeb34d5db611))
* **editor:** should not focus on the editor after loading ([d2290c8](https://github.com/lakejs/lake/commit/d2290c85f1eafe4900d7402aaf462cebc497825e))



## [0.1.4](https://github.com/lakejs/lake/compare/0.1.3...0.1.4) (2024-04-27)


### Features

* **editor:** add hasFocus property; remove lake-root-focused class ([7c2ef93](https://github.com/lakejs/lake/commit/7c2ef9322c4beed86b374afef9f3a49d3ee1c35d))



## [0.1.3](https://github.com/lakejs/lake/compare/0.1.2...0.1.3) (2024-04-26)


### Bug Fixes

* **code block:** in read-only mode, show caret ([0b99a48](https://github.com/lakejs/lake/commit/0b99a489f63c027f76202613b7074a710b62eadc))


### Features

* **alerts:** remove success, error types; change style; ([ee3fe50](https://github.com/lakejs/lake/commit/ee3fe507f9ab933680003e7e21c1917709cff410))
* **editor:** each editor can have its own lang setting ([0a488d9](https://github.com/lakejs/lake/commit/0a488d9339ea8c04fbf1cb6d71158801a7f57402))
* **markdown:** support short form of code block ([02da430](https://github.com/lakejs/lake/commit/02da430e232a2569d9a38d5cb6aa62f4df3dfe73))



## [0.1.2](https://github.com/lakejs/lake/compare/0.1.1...0.1.2) (2024-04-25)


### Bug Fixes

* **read-only:** when rendering editor, plugins should be executed ([2d343fe](https://github.com/lakejs/lake/commit/2d343fedc24d852dcb3bcc6164e9f51c81cba348))


### Features

* **code block:** add config ([eff9134](https://github.com/lakejs/lake/commit/eff913462c3fe15b332b9024d46ebf228b5b0180))



## [0.1.1](https://github.com/lakejs/lake/compare/0.1.0...0.1.1) (2024-04-23)


### Features

* **editor:** add setPluginConfig method; improve code around config ([884db6d](https://github.com/lakejs/lake/commit/884db6da552570902e98af7690c7e23e9b9e5b57))



# [0.1.0](https://github.com/lakejs/lake/compare/0.0.7...0.1.0) (2024-04-23)

### Features

* **core:** add HTML parser
* **core:** add text parser
* **core:** add history (undo, redo)
* **core:** support i18n
* **plugin:** add paste
* **plugin:** add select all
* **plugin:** add heading
* **plugin:** add blockquote
* **plugin:** add list (numbered list, bulleted list, checklist)
* **plugin:** add align (left, center, right, justify)
* **plugin:** add indent (increase, decrease)
* **plugin:** add bold
* **plugin:** add italic
* **plugin:** add underline
* **plugin:** add strikethrough
* **plugin:** add subscript
* **plugin:** add superscript
* **plugin:** add inline code
* **plugin:** add font family
* **plugin:** add font size
* **plugin:** add font color
* **plugin:** add highlight
* **plugin:** add remove format
* **plugin:** add markdown shortcuts
* **plugin:** add format painter
* **plugin:** add copy
* **plugin:** add cut
* **plugin:** add hr
* **plugin:** add image
* **plugin:** add link
* **plugin:** add code block
* **plugin:** add toolbar
