## [0.1.25](https://github.com/lakejs/lake/compare/0.1.24...0.1.25) (2024-09-07)


### Bug Fixes

* **equation:** improve words ([130ef06](https://github.com/lakejs/lake/commit/130ef066ca3a9d6edfeec7e828e9516c9b8dce51))



## [0.1.24](https://github.com/lakejs/lake/compare/0.1.23...0.1.24) (2024-09-05)


### Bug Fixes

* **selection:** if the range is outside, the native selection should not be updated ([b2097f8](https://github.com/lakejs/lake/commit/b2097f8761349bee5dc5e447986eac09e72710db))



## [0.1.23](https://github.com/lakejs/lake/compare/0.1.22...0.1.23) (2024-09-04)


### Bug Fixes

* **BoxResizer:** test case throws an exception on Firefox ([44980ce](https://github.com/lakejs/lake/commit/44980cec1e9f6ee17e0cbddcd340938dce95e826))
* **boxToolbar:** improve unmount method ([a15b1a2](https://github.com/lakejs/lake/commit/a15b1a2980143c8ae32694b83f53c1b788867abd))
* **BoxToolbar:** lake-custom-properties class is removed when hiding the toolbar of the box. ([5da1d9f](https://github.com/lakejs/lake/commit/5da1d9fd10ebdcf85e82acb17be36a0cf1e39532))
* **codeBlock:** event listener of dropdown not removed when unmounting editor ([2fa3e0d](https://github.com/lakejs/lake/commit/2fa3e0db36c88b11bb115a8cd3e15a80b4d64d5d))
* **command:** if the selection is outside the content, it should be moved to the end of the content ([42e35aa](https://github.com/lakejs/lake/commit/42e35aa67501e0d52db2b283342201f3b6bab15e))
* **commands:** create a new block after the enter key is pressed ([35f4ab9](https://github.com/lakejs/lake/commit/35f4ab9430f5acbec16eb240d22a7df191806c26))
* **Commands:** trigger mouseleave event when selecting item by keyboard ([1403575](https://github.com/lakejs/lake/commit/14035757fa33bf08a0d081f7697875a7fa1dafbe))
* copy, cut and paste events are triggered when the current selected range is not within the editor ([2551fb3](https://github.com/lakejs/lake/commit/2551fb3b20d86df69b33821680311bf3b26a0cbb))
* **editor:** event listeners are not removed when unmounting ([0bdd330](https://github.com/lakejs/lake/commit/0bdd33068640ac4a32a035ff31bd2402e3cd0fa6))
* **editor:** should clear debounce functions when unmounting editor ([5bc428d](https://github.com/lakejs/lake/commit/5bc428d38db05af0ff1110e2dac8b5d84aa424b7))
* **editor:** toolbar not removed when removing editor ([37c987f](https://github.com/lakejs/lake/commit/37c987f95925c639b4971fa6b71bca5ff4114fc2))
* **equation:** cannot hide textarea form after a new equation is inserted ([4a3e65d](https://github.com/lakejs/lake/commit/4a3e65d79f7be835f91dd825d00bac07fcbbdae1))
* **link:** focus on the end of the link after finishing link editing. ([911da02](https://github.com/lakejs/lake/commit/911da02d2fab3dbe0dac1f0a62df674212c40b5b))
* **link:** while popup for link is open, box cannot be selected when clicking on it ([542e581](https://github.com/lakejs/lake/commit/542e581718c66ddd23ee0639670abbab4fb8d966))
* **slash:** cannot search for custom items ([0cfedf8](https://github.com/lakejs/lake/commit/0cfedf83a10bea041c76112615473f5395fe401f))
* **slash:** cannot search items using a  keyword without spaces ([b08f029](https://github.com/lakejs/lake/commit/b08f02950cb50b758e08237dcb72576a34949ffd))
* **slash:** cannot select next item by arrow down key ([77930a8](https://github.com/lakejs/lake/commit/77930a8b1a18fee33445033e437287ff0dc51b7a))
* **slash:** each time the popup is opened, the container's width increases ([23c5463](https://github.com/lakejs/lake/commit/23c546389b03a361b45474c54983f236d3c16c1f))
* **slash:** improve i18n ([eae3bc7](https://github.com/lakejs/lake/commit/eae3bc79ee8dcefc081517e3ac8022b9f6c6da1f))
* **slash:** improve scroll behavior ([6de99aa](https://github.com/lakejs/lake/commit/6de99aa94bdaa685e74200a676ec9ef0ac42eb4b))
* **slash:** improve style ([b41fd57](https://github.com/lakejs/lake/commit/b41fd57a22bcba557063bf28a7ad7608e8c19248))
* **slash:** improve UX; add test cases ([d0a76f7](https://github.com/lakejs/lake/commit/d0a76f79ebf4c088be3e969ae9c68a20b6a6bf68))
* **slash:** incorrect item order in search mode ([49e8d01](https://github.com/lakejs/lake/commit/49e8d01793ce756bd7703e045847f69069ee1c23))
* **slash:** incorrect position when entering keyword ([d16e0e4](https://github.com/lakejs/lake/commit/d16e0e437dca4b5cc456ab6ccd461867229496b0))
* **slash:** incorrect width in composing mode ([2ab9f26](https://github.com/lakejs/lake/commit/2ab9f26b22e164a66b892f22351ec55d48be13e5))
* **slash:** lose focus after uploading a file ([8cf31d6](https://github.com/lakejs/lake/commit/8cf31d614b33831e5fb149a7eebb28f4aeccf0c6))
* **slash:** should remove format after selecting a command ([781b67d](https://github.com/lakejs/lake/commit/781b67d302d1f3fbba60e81542d860564bf3fc02))
* **slash:** show an empty popup box when no commands are found ([cdd3c01](https://github.com/lakejs/lake/commit/cdd3c018b19824861fb3ad173d4e40b0d47e1075))
* **toolbar:** event listener of dropdown not removed when unmounting toolbar ([d1709ab](https://github.com/lakejs/lake/commit/d1709ab5d53ba2f0b515930fc30250241134f9bb))
* **toolbar:** should not update state after the toolbar is removed ([844b9d5](https://github.com/lakejs/lake/commit/844b9d52bb124786a9693a1fd29a196f6482b773))


### Features

* **box:** getEditor method always returns an editor object ([b7b6a7f](https://github.com/lakejs/lake/commit/b7b6a7f1b480bdf82d6a977c79183f7e118fae41))
* **box:** set vertical alignment of inline box to middle ([5d43eff](https://github.com/lakejs/lake/commit/5d43effd78831d6e52e5d958165d8e0a8e225397))
* **Commands:** add keystroke ([b0d8a27](https://github.com/lakejs/lake/commit/b0d8a271f76228d811558ea3adf166b6689abe5f))
* **Commands:** close popup when clicking outside of it ([b6a2c66](https://github.com/lakejs/lake/commit/b6a2c66adf7ce6f900056cfb275e102eeebdeefd))
* **Commands:** improve keystroke ([a6d9b87](https://github.com/lakejs/lake/commit/a6d9b8715aa0d15b738f3361734a2cfe9cff8b51))
* **commands:** initiate ([f67d46d](https://github.com/lakejs/lake/commit/f67d46d87227bc74ec4514a67fe38ee7622e3ddf))
* **commands:** show commands dropdown when a slash is input at the beginning of a block ([e5b7ef1](https://github.com/lakejs/lake/commit/e5b7ef13f2eb3e9cab3906d83214e451b34cea93))
* **editor:** add scroll event ([55d8813](https://github.com/lakejs/lake/commit/55d8813e148266ef39513c5047b78fc7e5141dda))
* **Editor:** support excluding specific plugins ([54a8e2c](https://github.com/lakejs/lake/commit/54a8e2c58e39774552dde98855d652266a546459))
* enable a plugin by setting its config to true ([b27acc5](https://github.com/lakejs/lake/commit/b27acc50eb8126e7e09ef67a26675da2b38b66f2))
* **equation:** set focus on the textarea after inserting an equation ([d2e61e1](https://github.com/lakejs/lake/commit/d2e61e1358b54c8884970bfed1a45d7a8a4aee73))
* **keystroke:** remove alias ([57da2f4](https://github.com/lakejs/lake/commit/57da2f4e7ac548f0b9198be74284739cbd6a59f9))
* **nodes:** add value method ([2d79dd0](https://github.com/lakejs/lake/commit/2d79dd079932a53a2521396fc00cd64ef823373f))
* **plugin:** return unmount function ([22df5a5](https://github.com/lakejs/lake/commit/22df5a5b26967ce3260aeae1acaf65cd4f4d9008))
* **plugin:** use name to identify specific plugins ([770870a](https://github.com/lakejs/lake/commit/770870abbe07d86288a7fb8e82fd65f5edd45000))
* rename method from updatePosition to position ([668a689](https://github.com/lakejs/lake/commit/668a6890d9ce6e8743cdeb1e47c08468ec32b968))
* slash plugin is not available in the default options ([56ec54b](https://github.com/lakejs/lake/commit/56ec54bd91c985a193930d3348b0910c38967ac4))
* **slash:** add config ([14d4f11](https://github.com/lakejs/lake/commit/14d4f118d5f4b3f198bf32a8f054f32609062487))
* **slash:** add image and file ([b8c840c](https://github.com/lakejs/lake/commit/b8c840cba9dde5dcd81c0d1a68ac6fa936f39165))
* **slash:** add items config ([bf09ee3](https://github.com/lakejs/lake/commit/bf09ee3cd9d80b777ee109d35255e2d176d42b4a))
* **slash:** rename filename and variables from commands to slash ([c377415](https://github.com/lakejs/lake/commit/c37741565f1b38eaaefb290d519a5547a9177338))
* **slash:** support delete key ([73bc7f1](https://github.com/lakejs/lake/commit/73bc7f1cee76bb2e50e18aa9605a5f6baa11780f))
* **slash:** support i18n ([72ac09b](https://github.com/lakejs/lake/commit/72ac09be1e2882ca1f51fd1a1f53e01b96c8e689))
* **slash:** support search by keyword ([f02d781](https://github.com/lakejs/lake/commit/f02d7815a8fda7e74bef13089690af746dc5a31c))
* **slash:** use escape key to close popup ([3e29d2f](https://github.com/lakejs/lake/commit/3e29d2f910c4134e8fc528e1113f1a2c3ce16659))
* **Utils:** add scrollToNode function ([583484c](https://github.com/lakejs/lake/commit/583484cbed7b416ffacb510e39139c7858f001fa))
* **Utils:** rename function from nodeAndView to nodePosition ([6824548](https://github.com/lakejs/lake/commit/6824548c5447e70c3370d4117b85347adc9fe8e1))



## [0.1.22](https://github.com/lakejs/lake/compare/0.1.21...0.1.22) (2024-07-16)


### Bug Fixes

* **codeBlock:** backspace key deletes code block when all code is selected ([d4c24bf](https://github.com/lakejs/lake/commit/d4c24bf373d694d164a11a0b2afcfe9bb791eb53))
* **codeBlockBox:** poor performance when typing rapidly ([2af8052](https://github.com/lakejs/lake/commit/2af80527bca740ff9dca542badc65288cc451532))
* **Editor:** caret position is sometimes incorrect ([b0c4d9d](https://github.com/lakejs/lake/commit/b0c4d9d6257b109490a01e7ad5bbf5661d8c8d1f))
* **Editor:** poor performance when typing rapidly ([017560d](https://github.com/lakejs/lake/commit/017560d4f52a8c960a9599b17132cd2261427920))


### Features

* **Editor:** remove input event ([0c65a51](https://github.com/lakejs/lake/commit/0c65a51d2ba19c519d933f71e9fc6d5efc7a6374))



## [0.1.21](https://github.com/lakejs/lake/compare/0.1.20...0.1.21) (2024-07-13)


### Bug Fixes

* **Selection:** current selection will be changed when clicking outside the container ([1869d65](https://github.com/lakejs/lake/commit/1869d65e7c7d3e1e0abc7c56585191d5d12a04a3))
* **Toolbar:** new content should be inserted at the end of the editor when toolbar buttons are clicked ([9ae3158](https://github.com/lakejs/lake/commit/9ae3158fa810380b810638e315dc9ab66838feea))


### Features

* **Nodes:** add contains method ([2834af4](https://github.com/lakejs/lake/commit/2834af4d137cf2a8c3724ffb59d149a86ce9107b))



## [0.1.20](https://github.com/lakejs/lake/compare/0.1.19...0.1.20) (2024-07-11)


### Bug Fixes

* throw an error when rendering multiple editors ([daeb6a9](https://github.com/lakejs/lake/commit/daeb6a933167b5dd0b346d66ce9b64bc0ee914be))



## [0.1.19](https://github.com/lakejs/lake/compare/0.1.18...0.1.19) (2024-07-10)


### Bug Fixes

* **Box:** display incorrect text when inputting text at the start or end of an inline box in composition mode ([89c0c7b](https://github.com/lakejs/lake/commit/89c0c7b0f799b7855159eb7a4e7df3fe251e45b2))
* **HTMLParser:** class attribute does not support multiple values ([3cce249](https://github.com/lakejs/lake/commit/3cce249015ec3204398810db74752d0b35840eb9))
* **Range:** getRect method returns incorrect value with empty text node ([8d53728](https://github.com/lakejs/lake/commit/8d53728fa86c28202353e776e83e99597543e632))


### Features

* **Range:** add adjustBr method ([82d7053](https://github.com/lakejs/lake/commit/82d7053dc3146379a9d4e3d1a08c163b73ae1bf8))
* **Range:** improve shrinkAfter method ([5bbb2b4](https://github.com/lakejs/lake/commit/5bbb2b4b6735f2f6d830063b921d8454b40a2e50))
* **Utils:** add appendBreak function ([1a5deca](https://github.com/lakejs/lake/commit/1a5deca319e4934400c702a6d3d675cf6d7624c7))
* **Utils:** remove appendDeepest function ([2d8d83b](https://github.com/lakejs/lake/commit/2d8d83b986f403d11142482a227bb3a2db9fd337))
* **Utils:** rename function from getDeepest to getDeepElement ([87379c9](https://github.com/lakejs/lake/commit/87379c989a1389fd6e3c8921936cc34b13b93549))
* **Utils:** rename function from removeBr to removeBreak ([6be718f](https://github.com/lakejs/lake/commit/6be718f7c3750bc3a3ed9e44acb14aab20dcab8d))



## [0.1.18](https://github.com/lakejs/lake/compare/0.1.17...0.1.18) (2024-07-06)


### Bug Fixes

* **backspace key:** br should not be merged into non-paragraph blocks ([f8c9fff](https://github.com/lakejs/lake/commit/f8c9fff727f0f4a1faccdebcdf028048f33cb32f))
* **keystroke:** hotkeys should not be triggered in composition mode ([f96aa47](https://github.com/lakejs/lake/commit/f96aa4763078e448fc7fd15fdf57a50ec44277b4))
* **Nodes:** isEmpty method incorrectly returns true if a block contains multiple br nodes ([5480e7f](https://github.com/lakejs/lake/commit/5480e7f20440077044266b6952ef511e6f297e97))



## [0.1.17](https://github.com/lakejs/lake/compare/0.1.16...0.1.17) (2024-07-04)


### Bug Fixes

* **backspace key:** unable to remove the first br node ([c318240](https://github.com/lakejs/lake/commit/c318240afa8556ae931b285757e2ad0ef92cb867))
* **equation:** ensure the expression string is trimmed ([0a005db](https://github.com/lakejs/lake/commit/0a005db6c9e0b7a7bd0a4cb0c62779cdcd6ca976))
* **equation:** improve error status ([c3e0069](https://github.com/lakejs/lake/commit/c3e0069f7ec91cf616874924f313c1bfa7185bcb))
* **equation:** improve UI ([9b23704](https://github.com/lakejs/lake/commit/9b237049eb056c3057cf770cb7545a1214ce01e4))
* **equation:** prevent indenting the current block when pressing the tab key ([e619e89](https://github.com/lakejs/lake/commit/e619e890609d4ca7cf4d2feed17fe4653d7ecff9))
* **history:** doesn't re-render boxes with updated attributes when undoing or redoing ([396aca7](https://github.com/lakejs/lake/commit/396aca73df4c7525b1d421dde62c8fe8d0521ca5))
* placeholder is not removed when inserting composition text ([7fa391a](https://github.com/lakejs/lake/commit/7fa391a58bdfb3329d738441150550e86ac64460))
* prevent displaying duplicated contents when re-rendering a box ([164dfe7](https://github.com/lakejs/lake/commit/164dfe753770229842253a120dd8cbdc1f8c7e93))
* **range:** getRect throws an error with empty text node ([23bec1a](https://github.com/lakejs/lake/commit/23bec1af274285045e222c74b6da5dbf89b3fe12))
* **special character:** br node or selected contents are not removed before inserting a character ([eaf1ad1](https://github.com/lakejs/lake/commit/eaf1ad117cd151e36384a14c7d7e29c5b8f4138a))
* uncompleted text is inserted in composition mode ([3c63151](https://github.com/lakejs/lake/commit/3c63151c4b81b374e26cbdfcd2b6ad4bf06c14f5))
* when the caret is positioned behind a br tag, the input event is triggered twice ([936121d](https://github.com/lakejs/lake/commit/936121df0cc05fa3ffe04d0f856d1827508cf555))


### Features

* add equation box ([3fe1f5a](https://github.com/lakejs/lake/commit/3fe1f5a42be0f99c84c17a9370be417cf39d8853))
* add equation plugin ([40e8402](https://github.com/lakejs/lake/commit/40e8402776fe973df6053d147cec23da6bb958ab))
* add special character plugin ([a8906c8](https://github.com/lakejs/lake/commit/a8906c8e2e806af3be1e4019832d57e553725af4))
* **commands:** add popup ([3ec54f5](https://github.com/lakejs/lake/commit/3ec54f5705ad9a5b9e0cfd1d7c8d4cf868772cb5))
* **commands:** improve style of popup ([21cf8c4](https://github.com/lakejs/lake/commit/21cf8c4a62e0b0c7216207c935af45e1e6dccefe))
* disable undo and redo buttons when there is no data to do ([e179d4d](https://github.com/lakejs/lake/commit/e179d4d160bee868a4f6ee6b667df81a99faec8a))
* **HTMLParser:** remove getNodeList method ([8baf5cb](https://github.com/lakejs/lake/commit/8baf5cbe641399121d94b9625955c028f9214d62))
* **keystroke:** replace tinykeys with is-hotkey ([39531b6](https://github.com/lakejs/lake/commit/39531b6949b384b1ef1e01fc42fd3022163f2f0c))
* rename method from debug to info ([4cbc103](https://github.com/lakejs/lake/commit/4cbc103149470a08a181a4dd6b155234397ad0c3))



## [0.1.16](https://github.com/lakejs/lake/compare/0.1.15...0.1.16) (2024-06-21)


### Bug Fixes

* **box:** immediately update the classes after selection changed ([11a9191](https://github.com/lakejs/lake/commit/11a9191d7d40b7fd885f449b9ac0bfff9ab09f9c))
* **code block:** scroll to the top after selecting language ([05e05d4](https://github.com/lakejs/lake/commit/05e05d4d0265c0bc474495b2b116c3f0eebb3c5a))
* **dropdown:** no hovered effect ([dc78458](https://github.com/lakejs/lake/commit/dc784586ad004acfd1f9cd449d18cf528a0fe845))


### Features

* dropdown supports character ([217b422](https://github.com/lakejs/lake/commit/217b42208ce14ce0b1c949ce8f143a1ddb032114))
* **utils:** use native functions to encode or decode base64 ([009fa6f](https://github.com/lakejs/lake/commit/009fa6fc56481a1c6941f8d3fe4e31796ab09e2e))



## [0.1.15](https://github.com/lakejs/lake/compare/0.1.14...0.1.15) (2024-06-15)


### Bug Fixes

* **setBlocks:** indent attribute should not be added ([e89fc5a](https://github.com/lakejs/lake/commit/e89fc5abbf41755f05a330637d62626663bd1837))
* **upload:** ensure XHR in uploading status is always canceled when removing box ([d3716b0](https://github.com/lakejs/lake/commit/d3716b01933e90fbc012ce6a43b6b5c4f551a394))


### Features

* add emoji box ([a4232c4](https://github.com/lakejs/lake/commit/a4232c40e9785fd1befd32ded94adbb87316250d))
* add emoji plugin ([86efe76](https://github.com/lakejs/lake/commit/86efe76062d7ef72263e4ac33dcb2e8dbc64c9ff))
* **dropdown:** menu supports icon type ([758fc27](https://github.com/lakejs/lake/commit/758fc2765b103b27892a6a69fcb344e38c281679))
* **editor:** add historySize ([0b38265](https://github.com/lakejs/lake/commit/0b382658b84ac0118a4b4c55f479e8a4298e20ab))
* **editor:** remove boxselectionstylechange event ([ad35549](https://github.com/lakejs/lake/commit/ad3554970c3b931432817d412b2f2ca148298e42))
* **emoji:** dev finished ([1e38898](https://github.com/lakejs/lake/commit/1e388980b14623ac26abdff7457b627363c2342a))
* export insertBox and removeBox ([ba8e075](https://github.com/lakejs/lake/commit/ba8e075bd89ab8f1e5f6fcce03126aaa6d87543f))
* insertContents removed ([6c9744a](https://github.com/lakejs/lake/commit/6c9744aa45222376acf6b3c637c41feac267e159))
* move uploadFile from ui to utils ([1dd6bf0](https://github.com/lakejs/lake/commit/1dd6bf0e32fc1b2cf2b1c693593cee3f9d6a6f99))
* some methods support the first node only ([c1f1a97](https://github.com/lakejs/lake/commit/c1f1a97bc7ab418c5ee53ed7044bee0c55d470ee))



## [0.1.14](https://github.com/lakejs/lake/compare/0.1.13...0.1.14) (2024-06-03)


### Bug Fixes

* **backspace key:** empty code block should be removed ([120645a](https://github.com/lakejs/lake/commit/120645afb860af24650a9e56a7fc0ab8ba7f4717))
* **backspace:** after deleting the last character inside a mark, br should not be added ([7f0a51e](https://github.com/lakejs/lake/commit/7f0a51e818de693b7cf4919df0d9761c7b85b5e0))
* **backspace:** should remove empty marks when merging two blocks ([b0d50cb](https://github.com/lakejs/lake/commit/b0d50cb7c72fd5b835531213c921664f35a45953))
* history not saved after fixing incorrect content ([a2df268](https://github.com/lakejs/lake/commit/a2df268998ab56daa25ee5346f04ae030ae68354))
* **history:** index is incorrect when undoing ([0f008ec](https://github.com/lakejs/lake/commit/0f008ec0b939fee7fe8f4a1245e4cfe2e8f43d60))
* **history:** sometimes cannot undo ([3441f5f](https://github.com/lakejs/lake/commit/3441f5ffab51b610363ea94b139f201dc00658a9))
* **markdown:** history should not be saved after executing a command ([db2e322](https://github.com/lakejs/lake/commit/db2e3229776aeac14cd8beafcd4972b03c5511fc))
* minChangeSize config does not work ([b3aaa9a](https://github.com/lakejs/lake/commit/b3aaa9ac4806a44abb4ad83ca96bbde2a12a9d14))
* scrolling to wrong position when deleting text with an empty text node ([3ed1d87](https://github.com/lakejs/lake/commit/3ed1d871bccacfddf48bf8ab0b9edd96c816093f))
* should avoid changing the DOM tree when getting value ([8e450b5](https://github.com/lakejs/lake/commit/8e450b5ba50f395a549df5318e24b46c334b23a3))
* the editor sometimes loses the caret ([6a5f218](https://github.com/lakejs/lake/commit/6a5f21874b53ca202d6f0f499bc42627c43c29af))
* **toBookmark:** zero width space should not be removed ([1e4c1d2](https://github.com/lakejs/lake/commit/1e4c1d2458335149393964824f163e18a6d35cf5))
* unsaved input data isn't reset after the length reaches minChangeSize ([c7c3c0e](https://github.com/lakejs/lake/commit/c7c3c0ebb7619c04eca8bcdf582add456dbe8439))
* value of change event is incorrect after fixing incorrect content ([4c5e1be](https://github.com/lakejs/lake/commit/4c5e1bebed53e0b71146065262aa64c7dec5a0bb))


### Features

* **editor:** remove  prepareOperation and commitOperation methods ([9187f25](https://github.com/lakejs/lake/commit/9187f25bfcf63e22a51639da8efb629a3e76a6cc))
* **history:** change accessibility of list and index from private to public ([2bc2ab3](https://github.com/lakejs/lake/commit/2bc2ab3487cfabf69d82e77623dc8b35036fcced))



## [0.1.13](https://github.com/lakejs/lake/compare/0.1.12...0.1.13) (2024-05-27)


### Bug Fixes

* **copy / cut:** adjust the selection when multiple boxes are selected ([c38aad0](https://github.com/lakejs/lake/commit/c38aad0f1b24cc8df5f708e990d3cfafc9f98356))
* **copy / cut:** improve adjusting; rename methods from adapt to adjust ([534d675](https://github.com/lakejs/lake/commit/534d67560c42b42fa09a47c45032e3168b00b772))
* **file:** wrong style in headings ([175b284](https://github.com/lakejs/lake/commit/175b284c1497df5a5c050f86518e7147d23a93ba))
* **history:** sometimes the index is not subtracted when undoing ([c3cdb19](https://github.com/lakejs/lake/commit/c3cdb19490c9416ee60af58d6152de115f66210c))
* incorrect content generated when copying or cutting ([a16e195](https://github.com/lakejs/lake/commit/a16e195d287ba67c04e337b25b1ce3a979db228d))
* **paste:** inline box not rendered after copy and paste ([47f99a4](https://github.com/lakejs/lake/commit/47f99a42e86ef759f04247b121b570195ad5eb9a))
* **paste:** throw an error when pasting multiple inline boxes into empty block ([12511ff](https://github.com/lakejs/lake/commit/12511ff5ccf6f6dd01ec482c7171304012994c0f))
* **video:** styling issue in headings ([c9abd3e](https://github.com/lakejs/lake/commit/c9abd3e15a4af94331b11fff4707781927987990))
* when there are multiple editors, the focus jumps to the wrong position after inserting content ([193c92a](https://github.com/lakejs/lake/commit/193c92adc8876a97860ffcd159a4647a9ae15df4))


### Features

* **editor:** move box instance methods to the editor class ([a5ae9e7](https://github.com/lakejs/lake/commit/a5ae9e7d0aa5724b6d69e5c425d6cad53d1c3d76))



## [0.1.12](https://github.com/lakejs/lake/compare/0.1.11...0.1.12) (2024-05-21)


### Bug Fixes

* **box toolbar:** unable to display divider ([02fbbbe](https://github.com/lakejs/lake/commit/02fbbbeb83467de187bc80b749678e6566a16e12))
* **box:** should not display boxes in undone status ([89dab49](https://github.com/lakejs/lake/commit/89dab493693544bda8f168aa79127ce928640b51))
* **getBox:** should save all instances ([dbdc642](https://github.com/lakejs/lake/commit/dbdc642da5e577125adb85ece7fc8dedad52677a))
* **image:** throw an error after removing an image before it finishes loading ([33595b2](https://github.com/lakejs/lake/commit/33595b2a4c8f3c7ec0f95b418179522fa5dcf795))
* **readonly:** cannot select code or filename ([6d73990](https://github.com/lakejs/lake/commit/6d7399031c765e6eb8386ac560efbb36718556be))
* **video:** after inserting the form, the input field has focus ([3d4e9c0](https://github.com/lakejs/lake/commit/3d4e9c00f152f5e4f56f4377db9e3908173c0597))
* **video:** improve style ([922aa3c](https://github.com/lakejs/lake/commit/922aa3cef3ddb76e6d8564eedc830f0370e9cc96))
* **video:** improve UX ([a0394b5](https://github.com/lakejs/lake/commit/a0394b504b8ecf8a37639264dae54c9c83ebc8e8))
* **video:** prevent default behavior for keydown ([8566857](https://github.com/lakejs/lake/commit/8566857ce8f9698fa737928e90bdc0323f3fba49))
* **video:** should not display unfinished box in read-only mode ([ed7b06a](https://github.com/lakejs/lake/commit/ed7b06ab00739edad3f36fe8a187018ef5365a78))


### Features

* **box:** add beforeunmount event; remove useEffect method ([7bf8411](https://github.com/lakejs/lake/commit/7bf84116fd50edafae218851e03152c27b1df29b))
* **box:** add setToolbar method ([5c1ab5f](https://github.com/lakejs/lake/commit/5c1ab5f5dd5f8c0ea071cfbef3fcf9dd0b0f2266))
* **box:** extract resizer ([7bdec6b](https://github.com/lakejs/lake/commit/7bdec6bfb2152e52db3b0c7e3d996fd57d1c7140))
* **link:** support saving by pressing enter key ([53b3b83](https://github.com/lakejs/lake/commit/53b3b8369063fdee9ffd9ef70f6e4a58e52532d4))
* **video:** add remove button ([8f4a082](https://github.com/lakejs/lake/commit/8f4a082d1ad65aebd731141e66a38b2e50a88b24))
* **video:** complete main function ([0c91620](https://github.com/lakejs/lake/commit/0c916200979a01b437ef1a96449b51ff1ef8af61))
* **video:** initiate ([7967154](https://github.com/lakejs/lake/commit/7967154a4c5c2f9d89f4ea389685e357e54617a8))
* **video:** input form supports enter key ([099dbb9](https://github.com/lakejs/lake/commit/099dbb94923b378166d1cf5b298b8451b91ebf7e))
* **video:** video supports i18n ([68aca2b](https://github.com/lakejs/lake/commit/68aca2b894d111cd2296b67029adef36ac74c6d9))



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

* **box:** avoid generating duplicate box instance ([cfbc045](https://github.com/lakejs/lake/commit/cfbc045bd1d935bf74a8ed30c6b5ff87cbd2c4b8))
* **box:** cannot select inline box ([3a15b4b](https://github.com/lakejs/lake/commit/3a15b4b73914dbfacbbe179ba8ad67a1e8265fee))
* **box:** lose focus after removing an image or file ([7e6eb0d](https://github.com/lakejs/lake/commit/7e6eb0d191c45416a17e140bfcf1742555a0ef38))
* **box:** the toolbar sometimes flickers when scrolling ([23ff02a](https://github.com/lakejs/lake/commit/23ff02a3b59b7de3dfc0efaf7475aa00bccc8289))
* **nodeAndView:** returns an incorrect top value when the page has a scrollbar ([a5c926e](https://github.com/lakejs/lake/commit/a5c926e39fca39c106961932d758dd027c874f07))


### Features

* add file ([c2e229e](https://github.com/lakejs/lake/commit/c2e229e6b301e2fc184dca14010ded5211deed3d))
* add toolbar for box ([054b8ce](https://github.com/lakejs/lake/commit/054b8ce1b192b64bf12aede182b342b0bc196f4e))
* **editor:** add selectBox method ([669b135](https://github.com/lakejs/lake/commit/669b1357e8ba94b29aaea628837e21bb0958e4cc))
* **editor:** enhance removeBox method ([7f78eb5](https://github.com/lakejs/lake/commit/7f78eb5cc46c87a2c510ba2245ca90d9c8149799))
* **file:** complete main development ([acfcb39](https://github.com/lakejs/lake/commit/acfcb39d56483be6e5d83e89a5403f39e1b5b3c8))
* **file:** development ([b760157](https://github.com/lakejs/lake/commit/b760157ce46bc09ac849960c509d4613b86981c6))
* getBox supports boxName ([1ba5162](https://github.com/lakejs/lake/commit/1ba516221727b672212acef9e4456ce987e60fff))
* **utils:** add nodeAndView ([efc45f9](https://github.com/lakejs/lake/commit/efc45f988d2ccaac74abd3fa736161e2f26aa8c1))



## [0.1.8](https://github.com/lakejs/lake/compare/0.1.7...0.1.8) (2024-05-10)


### Bug Fixes

* cannot copy or cut a box ([c4106ad](https://github.com/lakejs/lake/commit/c4106ad57ba9554642fa5d831b60f1eb37825a1c))
* does not scroll to caret after inputting text outside viewport ([4592977](https://github.com/lakejs/lake/commit/45929774f2f4c49c48dec677d4f86f3359f6ea29))
* **drop:** improve indication rod ([2744d44](https://github.com/lakejs/lake/commit/2744d441fb71613ef1f4341be1ca89b6c1976e1b))
* **drop:** improve user experience ([d1a7020](https://github.com/lakejs/lake/commit/d1a7020df2b0c72373aec147923fad415d8217fb))
* **drop:** should not re-create box when inserted into above the box ([3abb0f3](https://github.com/lakejs/lake/commit/3abb0f3a5e2456ec1bb2d17125ea4e1e37f9aa08))
* **drop:** the indication bar covered by background of parent node ([a76bc83](https://github.com/lakejs/lake/commit/a76bc83720be1569e98f092b48a457e609327b72))
* **drop:** unmount method called twice ([044f6c1](https://github.com/lakejs/lake/commit/044f6c1483e22681dabf992d8b355e1c4354f8b9))
* **drop:** when there is a block and a box, the box cannot be dragged and dropped into the top position ([53e9668](https://github.com/lakejs/lake/commit/53e9668089fd0e32831bb22a340b7e474735da25))
* **editor:** scrollToCaret is not working when overflow is visible. ([4207100](https://github.com/lakejs/lake/commit/42071005666a3619e35b339a06995cea62894fe6))
* **image:** cannot resize image ([21a0202](https://github.com/lakejs/lake/commit/21a0202a999c7c84a9c02d1661fd112f47bb864a))
* **image:** lose focus when zooming in the iOS ([bdc9a13](https://github.com/lakejs/lake/commit/bdc9a13d62471a1d75bc4adf0609cf96d5a37b58))
* **paste:** cannot paste when selecting a box ([86b0d19](https://github.com/lakejs/lake/commit/86b0d1979fbcba737859442091c6d33c96e18d95))


### Features

* **drop:** not support dropping a file from outside ([797d8b2](https://github.com/lakejs/lake/commit/797d8b28c0997d5de924edcd03cc118483f82014))
* **drop:** show indication rod when dragging ([22a832f](https://github.com/lakejs/lake/commit/22a832fd8000f99d5ccf81789237c9f034c41466))
* **selection:** add scrollIntoView method ([177cf79](https://github.com/lakejs/lake/commit/177cf7973de4b7035fe235c5fa503200894cc4b6))
* support drag-and-drop feature used to moving a block or a box ([e2c1064](https://github.com/lakejs/lake/commit/e2c1064026e38035326ae2e7f0f8f957f88ef5e8))



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
* should remove all listeners when unmounting ([6a0b4d2](https://github.com/lakejs/lake/commit/6a0b4d258c618f743a4e0b24d71641992626fc72))


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
* each editor can have its own lang setting ([0a488d9](https://github.com/lakejs/lake/commit/0a488d9339ea8c04fbf1cb6d71158801a7f57402))
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


### Bug Fixes

* **code block:** language dropdown always aligned to the right position ([2acc6c7](https://github.com/lakejs/lake/commit/2acc6c769d486cbb47c466581a7c9a1750ad7d01))
* delete button should not be displayed in readonly mode ([609fef1](https://github.com/lakejs/lake/commit/609fef1374fad36f12d38d7345b335c6d27ca9ee))
* **editor:** should not scroll the document to editor when rendering ([604b2aa](https://github.com/lakejs/lake/commit/604b2aad20ce94fed7912a5ee4d813ce7a104336))
* for supporting dark theme, default color should not be set ([c73899d](https://github.com/lakejs/lake/commit/c73899d21fdc1473d7b9a2be5424a5d7c1342dfa))
* **format painter:** should not apply style to another editor ([54c9dd1](https://github.com/lakejs/lake/commit/54c9dd1329a99eb801023ef161add2bd940968bb))
* **heading:** set line height to normal to avoid being reset ([7af4446](https://github.com/lakejs/lake/commit/7af44464cbb06a2a9b20a65968266aa562f934ef))
* **link:** cannot update link when there are multiple editors ([d31d7e6](https://github.com/lakejs/lake/commit/d31d7e60dc58fb60ca82558e59952c979ef0dc15))
* **markdown:** hr should not be inserted when there are less than three minuses ([18f3665](https://github.com/lakejs/lake/commit/18f36658c3b957f13a5f4b4283e9e3ea0891de29))
* not support reloading script ([c6b4c3c](https://github.com/lakejs/lake/commit/c6b4c3c42147c61e1a2c221e659ea0319d4ef593))
* **style:** add box-sizing ([4f2ed8e](https://github.com/lakejs/lake/commit/4f2ed8eac12da90d42fef3323d3d8a81c81601bb))


### Features

* **markdown:** shortcuts support alert box ([0379df7](https://github.com/lakejs/lake/commit/0379df7ab61c3b311ac5ae8e8dd837bdd385b39a))



## [0.0.7](https://github.com/lakejs/lake/compare/0.0.5...0.0.7) (2024-04-17)


### Bug Fixes

* cannot trigger compositionend event when caret is after br ([330a8bf](https://github.com/lakejs/lake/commit/330a8bfbe2a35509c010a217cef68e4bb24e7402))
* **editor:** should not emit change event when committing unsaved content ([66f4174](https://github.com/lakejs/lake/commit/66f41740c4caea18c6ea2b7c91f252bef0c99833))
* **editor:** sometimes not emitting change event ([d294721](https://github.com/lakejs/lake/commit/d2947217045550a44d92d6d142dce6ce486c0409))
* **image:** emit closefullscreen event when PhotoSwipe is not fully closed ([7ce1471](https://github.com/lakejs/lake/commit/7ce14716f0146e7749004357afbcab4a57c696c5))
* **image:** scrolling to first line after closing full screen ([abb8ea9](https://github.com/lakejs/lake/commit/abb8ea9c6375194f5b2decef92a09e48148cd7d7))
* **link:** move caret to the end of the link after saving link ([74b67fa](https://github.com/lakejs/lake/commit/74b67fa2d5d100a4258bacffdf2de54c4b49fb8e))
* **link:** move caret to the end of title of link after unlink ([5890fba](https://github.com/lakejs/lake/commit/5890fbad8e7844ff23e46769cebc1a80161505c6))
* should not emit statechange event if state data has not changed ([69f4b0a](https://github.com/lakejs/lake/commit/69f4b0ab75a4831c66855348245733f079bbf92e))
* **style:** show wrong ui with reset css ([76af3e0](https://github.com/lakejs/lake/commit/76af3e0612ab0c2509ab4fe1d78ae989224b2af0))
* **test:** change main to master ([8a0df56](https://github.com/lakejs/lake/commit/8a0df56ae24ab0d299bc4bac5abe6b98c327f866))


### Features

* extract CodeMirror to lake-codemirror ([80b2fd6](https://github.com/lakejs/lake/commit/80b2fd62ba5bd6a030cc4672a6acdbbfc1d84d82))
* **toolbar:** remove fontSize item from default items ([6d2b907](https://github.com/lakejs/lake/commit/6d2b90749340a3e6fbc8d8401bac8ea17a88c818))



## [0.0.5](https://github.com/lakejs/lake/compare/0.0.4...0.0.5) (2024-04-12)



## [0.0.4](https://github.com/lakejs/lake/compare/0.0.3...0.0.4) (2024-04-12)


### Bug Fixes

* **code block:** use inset-inline-end instead of right ([120730e](https://github.com/lakejs/lake/commit/120730eca3ebb9ca33d59054271d9a562e489555))
* does not display language select box when focusing on box ([1e0410a](https://github.com/lakejs/lake/commit/1e0410aa5c4785de9254681f94a12a3fd2a26492))
* **editor:** shoud not activate box when clicking box ([fab2de3](https://github.com/lakejs/lake/commit/fab2de326f7f2e05278b161dbba7a1fae8a46092))


### Features

* **box:** rename left / right to start / end for rtl direction ([d295af0](https://github.com/lakejs/lake/commit/d295af0f93596ad06d7c405335c4c1c91857ddcc))
* **Editor class:** add toolbar to config, render toolbar in the render method ([fafe553](https://github.com/lakejs/lake/commit/fafe55334b7fec089fb01cdc37b0a91f6e3e3274))
* **plugins:** add escape key ([d339aa6](https://github.com/lakejs/lake/commit/d339aa6148d6fd39445a8a20f54f679cbd02f1f1))
* **range:** rename method from getLeftText / getRightText to getStartText / getEndText for rtl direction ([e971cc3](https://github.com/lakejs/lake/commit/e971cc39be9bae5914b15c8cb96facdf1904d42c))
* **toolbar:** add updateState method; remove binding statechange event from toolbar ([487a401](https://github.com/lakejs/lake/commit/487a401d793f658c44c58f4e1429cedfe52a937a))



## [0.0.3](https://github.com/lakejs/lake/compare/0.0.2...0.0.3) (2024-04-11)


### Bug Fixes

* **align:** should support start / end ([1feccb1](https://github.com/lakejs/lake/commit/1feccb1603531869575b7ad354b6c25dc09961e3))
* **backspace / delete key:** cannot delete br when there is no text ([51af8c8](https://github.com/lakejs/lake/commit/51af8c805f131a87606fe799312dac45f65334fd))
* boxes should support readonly mode ([4b37f3d](https://github.com/lakejs/lake/commit/4b37f3de076c32281e5ee34e82d617e4964fd9ef))
* **button:** should not add hovered class when button is selected ([104cb82](https://github.com/lakejs/lake/commit/104cb82938e788f7f8132fb71dbe513b74d00f1b))
* **dropdown:** improve menu closing by clicking document ([01de79d](https://github.com/lakejs/lake/commit/01de79de602d6106f1451f33a066226a11b2bc7a))
* **Editor:** document click event should not be emitted when clicking popup ([d059fca](https://github.com/lakejs/lake/commit/d059fca5644b5062bfaaae6cfac2bff490a67a65))
* **link popup:** copy event should be emitted when having error ([d2e9d78](https://github.com/lakejs/lake/commit/d2e9d7866a780a76a3f75631a0473829727fcf88))
* **link popup:** improve saving operation when title is empty ([39fb63a](https://github.com/lakejs/lake/commit/39fb63a03841e9ee08c610eb00360a8663e8364c))
* **link:** cannot close popup when clicking outside editor ([4ce60c9](https://github.com/lakejs/lake/commit/4ce60c99cec261491baba044740847c3ed90e1a6))
* **LinkPopup:** sometimes the positon is incorrect ([7fb60d7](https://github.com/lakejs/lake/commit/7fb60d704515cf79850f3248b349d58477180b78))
* **link:** should not display popup when the link node is outside the editor ([2e16f47](https://github.com/lakejs/lake/commit/2e16f474dbba0b5b9d920c1f43633f666bf0c1de))
* **list:** statechange shuold not return empty string ([863c005](https://github.com/lakejs/lake/commit/863c005020f54bb752af7ee2e190546514036a05))
* **markdown:** should not execute command when the command does not exist ([fe2f2e4](https://github.com/lakejs/lake/commit/fe2f2e47a0f58983d63cf42fc6d8016b8b9b16d6))
* should not be able to focus on buttons in the toolbar ([6911083](https://github.com/lakejs/lake/commit/69110832b955e40fccf8ea7dc48dcc46a6e11c9f))
* should rectify wrong content ([2620662](https://github.com/lakejs/lake/commit/2620662b576111293555b6487e2d64eae73aa155))
* **tests:** copying a link to clipboard sometimes failed ([fdec5a4](https://github.com/lakejs/lake/commit/fdec5a47eeb8cca0a13018f3cbca4df937def981))
* **toolbar:** buttons have no selected effect because of wrong class name ([ff5150b](https://github.com/lakejs/lake/commit/ff5150bf5364c047db19e172062233ebdb87a83b))
* unable to load when large third-party libraries are not included ([7071075](https://github.com/lakejs/lake/commit/707107565e69bc67f341edc8756efe5c6e160fef))
* **upload:** should focus on editor before upload ([bcd9cb9](https://github.com/lakejs/lake/commit/bcd9cb9b8d560a9d9d3d0b97263415bbc4080f98))


### Features

* **code block:** add SQL language; use custom setting instead of basicSetup; customize highlight style ([3014f53](https://github.com/lakejs/lake/commit/3014f538564bfbc561f885118c7aed13f831f194))
* **code block:** move CodeMirror from dependencies to devDependencies; improve style ([007ea71](https://github.com/lakejs/lake/commit/007ea711d730b008c24a1b78c058fa2b0e4b841e))
* codeBlock supports selecting language; improve test performance ([36c491f](https://github.com/lakejs/lake/commit/36c491f02d173d9240db0ed397ca88951d5208c0))
* **codeBlock:** add i18n for tooltip ([9d51f69](https://github.com/lakejs/lake/commit/9d51f6941cddd70941a6a33938ad04c479d34162))
* **dropdown:** extract dropdown component from toolbar ([bcc92fb](https://github.com/lakejs/lake/commit/bcc92fb1f223bcbbc3f45f63937ed38e1cf3c8b2))
* **Editor:** add boxselectionstylechange event for test ([a0931dc](https://github.com/lakejs/lake/commit/a0931dc30cb59aa982e1958b2369d5bef5d42a65))
* **Editor:** add statechange event; refactor command ([c9ba253](https://github.com/lakejs/lake/commit/c9ba2539c22fe76efd20ed5b5f2caf1cb7a77ea6))
* **editor:** add tabIndex, indentWithTab to config; support focusing movement by tab key ([46456af](https://github.com/lakejs/lake/commit/46456aff4a4f9ce91e9e3461206471c633cbd033))
* **Editor:** remove mouseover event ([cf1292b](https://github.com/lakejs/lake/commit/cf1292bd1532832aebcbe52ceef4560a7c4a12f6))
* extract button component from toolbar ([82f463e](https://github.com/lakejs/lake/commit/82f463e152eca2413e712cf9f3e96d16f462169b))
* **i18n:** add i18n for image ([26b643b](https://github.com/lakejs/lake/commit/26b643ba88feec7bdef4dac31efe532b2d729146))
* **i18n:** add Japanese ([09db252](https://github.com/lakejs/lake/commit/09db2525e460fe21dd55318922d312621239ef0d))
* **i18n:** add korean ([01abd9b](https://github.com/lakejs/lake/commit/01abd9b6e0f62bcd6b39e21494e4ba408805d321))
* **i18n:** link supports i18n ([6d7e1af](https://github.com/lakejs/lake/commit/6d7e1afed4161cb917f98ce8b1fc30e49a5311d4))
* **i18n:** toolbar supports i18n ([e30ec43](https://github.com/lakejs/lake/commit/e30ec43feaacfaa1551aeb758b2828d7bfd77843))
* keybinding tooltip supports cross platform ([9a5154d](https://github.com/lakejs/lake/commit/9a5154d152ee6b44fe289c28617d2da301697065))
* **markdown:** support inserting hr and codeBlock ([76086b9](https://github.com/lakejs/lake/commit/76086b967948e00851348d71a12c33dff6b8fce1))
* move innerWidth from Editor to Nodes ([1944de9](https://github.com/lakejs/lake/commit/1944de9191c1a0509ac8e3afedf464e13b134554))
* **Selection:** remove appliedItems property ([9ce1b52](https://github.com/lakejs/lake/commit/9ce1b520a8b406d231512a169481e3f48176168b))
* support i18n ([0f712d1](https://github.com/lakejs/lake/commit/0f712d1de36cde64b436272bf61888f786f85dab))



## [0.0.2](https://github.com/lakejs/lake/compare/85380209c749ae6f0330049c9b4f1f7e7bdfa31c...0.0.2) (2024-04-02)


### Bug Fixes

*  should trim invisible whitespace ([822edc7](https://github.com/lakejs/lake/commit/822edc735bfc1b1012836bcffb2ee4c6200050a7))
* **addMark:** have wrong behavior when the cursor is at both side of the box ([26945bb](https://github.com/lakejs/lake/commit/26945bbfc98fb0c7c0cad3390170acdbaf90e3e7))
* **addMark:** incorrect behavior when cursor is on either side of inline box ([6263abc](https://github.com/lakejs/lake/commit/6263abc8bf95ab87f4fbf1bc9ebb287e191b6e0c))
* **addMark:** mark should be added when only text is selected ([32b7cfd](https://github.com/lakejs/lake/commit/32b7cfd9903fad079360ec5c7f073c461fb6ee32))
* **addMark:** should remove br ([31b78b3](https://github.com/lakejs/lake/commit/31b78b3fa8eca5fc9bb74d29510fb0bcca7f6333))
* **addMark:** there is a zero-width space after toggling bold ([196971c](https://github.com/lakejs/lake/commit/196971c4309fe57d18d1e05ef84e438a55edbd2f))
* after selecting content around a box, the box has no selection style ([cee9ead](https://github.com/lakejs/lake/commit/cee9eaddd5b07cd4f10d9a617adb5eacf4d89c86))
* arrow keys adapt to inputting in the box ([20b42ed](https://github.com/lakejs/lake/commit/20b42ed09aa8aec25a6086a7c9c62fe3b4bca803))
* **arrow-keys:** improve behavior of arrow-up and arrow-down ([4ea4eab](https://github.com/lakejs/lake/commit/4ea4eabca4499f509fd045a5d9083443c8e353b5))
* **arrow-keys:** improve behavior of block box ([ff0bad1](https://github.com/lakejs/lake/commit/ff0bad14a0f904d3009272f4147c13e6b992b42c))
* **backspace / delete key:** cannot remove the next or previous inline box ([62900ce](https://github.com/lakejs/lake/commit/62900ce2561efd69b8828da62c7fca074bc1d14b))
* **backspace / delete key:** should not merge two blocks when the left or right content contains inline box ([1cc7a0d](https://github.com/lakejs/lake/commit/1cc7a0de4dfde2e2fef97b7c119aff03f99d9437))
* **backspace-key:** paragraph cannot merge with text or br ([ef2d4cf](https://github.com/lakejs/lake/commit/ef2d4cf5d28dea0482df42bbd01068a85c0a7535))
* **backspace-key:** should decrease indentation ([7255a27](https://github.com/lakejs/lake/commit/7255a27242735900074c7a1b366b8a431cb4a8d8))
* **backspace-key:** should keep empty paragraph after removing all content ([a82d2a3](https://github.com/lakejs/lake/commit/a82d2a350c47daf991707ee36d75a14c863a87cf))
* **backspace-key:** should not merge heading into empty paragraph ([6365593](https://github.com/lakejs/lake/commit/636559388cb89d9ae264fb9eddae4b8afd211756))
* **backspace:** br tag should be appended after removing the only inline box ([d0a79b3](https://github.com/lakejs/lake/commit/d0a79b368946a6bd10f1ff0e6501938458b96273))
* **backspace:** enhance ability ([9df6a75](https://github.com/lakejs/lake/commit/9df6a75dfb5fbc1761102ad691a79e53ee242ddd))
* **backspace:** improve code about figure ([4152d57](https://github.com/lakejs/lake/commit/4152d57c7b121fe30b8fa896bb8117b442b54015))
* **backspace:** incorrect behavior when  the cursor is on left strip of box ([fd19766](https://github.com/lakejs/lake/commit/fd1976660918f9e6516b3ec684c28c8a648b7002))
* **backspace:** should merge both blocks after deleting contents ([1498c67](https://github.com/lakejs/lake/commit/1498c6774da637bd2f4e2e720f8df31704c1384a))
* **backspace:** should move cursor instead of removing box ([d08535c](https://github.com/lakejs/lake/commit/d08535cabe98570ca4dd669ed8d30454dcede1cf))
* **backspace:** when cursor is at the  beginning of list or blockquote, current block should be converted to paragraph ([ee7ddc1](https://github.com/lakejs/lake/commit/ee7ddc1cba5ab9d691162fe279e86f182887d504))
* behavior of inputting on either strip of inline box does not correct ([e7beb37](https://github.com/lakejs/lake/commit/e7beb373341eb30695815327bc4832a3da06af72))
* **bold:** invalid result when no text is selected ([b8ffcf3](https://github.com/lakejs/lake/commit/b8ffcf35d069b07214f53efc3eeb24d68540dcfc))
* **bold:** loses selection after executing bold and italic ([cfa87be](https://github.com/lakejs/lake/commit/cfa87be6d2207ba195ccee13d5a64a6358e706c5))
* bookmark doesn't support box ([184614a](https://github.com/lakejs/lake/commit/184614ad7adb49ebf8f11a8be7e19765f174e307))
* box strip can be removed by backspace or delete key ([3e93947](https://github.com/lakejs/lake/commit/3e939476cd413e3af6517bf4fe39da2e1a4c6b5d))
* box was removed when inputting in it ([f1bfff5](https://github.com/lakejs/lake/commit/f1bfff5b3246fb63520de62dfa5bad977d631c91))
* **box:** block box is activated when clicking its left or right side ([a875133](https://github.com/lakejs/lake/commit/a875133de893a17b6ac82565990956e4c36b5b45))
* **box:** either side of box should not have selection style ([570c837](https://github.com/lakejs/lake/commit/570c837da1cca7732e520d4d68137655f843bba8))
* **box:** focus class should not be added to a box already focused ([12e7342](https://github.com/lakejs/lake/commit/12e73423baf46d2dcf84997cfd94e87a983c36a0))
* **box:** improve cursor movement around inline-box by left / right key ([a201aa9](https://github.com/lakejs/lake/commit/a201aa9b7aa8356ab707a9defb6f110a49579a69))
* **box:** render incorrect content when redoing ([9e25779](https://github.com/lakejs/lake/commit/9e25779a90819db05e12b8f5ef3077a6466897c0))
* **box:** unable to find the elements of box container in the userEffect function ([54713c7](https://github.com/lakejs/lake/commit/54713c7411db5b990eba78caad3b674e0c760eb7))
* bug about inline box ([56f1c7b](https://github.com/lakejs/lake/commit/56f1c7be956e94b98d5bd7a9f210e6e8a3c4d731))
* cannot focus in box by clicking edge ([5a5cb12](https://github.com/lakejs/lake/commit/5a5cb12f3a62071467621d4c304db3a0d38aebbb))
* cannot input text in the box. PS happy  new year ([8bc81de](https://github.com/lakejs/lake/commit/8bc81dea890a89cef23e3d7a2ac971e8e26de5dd))
* cannot remove empty mark with zeroWidthSpace ([87ca39a](https://github.com/lakejs/lake/commit/87ca39a1a06e983595deab26b9afcde758eb21d5))
* **checklist:** cannot show popup when clicking a link in checklist ([dc570ea](https://github.com/lakejs/lake/commit/dc570ea9b54bccb8ae0bc50bfd3a935e7d734522))
* **checklist:** show wrong style when text in the list has font size ([8df1f8d](https://github.com/lakejs/lake/commit/8df1f8da983ff9a72d127106739abb6d75a17346))
* **checklist:** throw error when event.target does not exist ([2002719](https://github.com/lakejs/lake/commit/200271947b6127d58f824c92f175e16d7c408a57))
* **code-block:** overflow code should be scrolled into view ([ffb23d3](https://github.com/lakejs/lake/commit/ffb23d3829c26614b590f69d2677d3a5505fb41d))
* **codeBlock:** cannot delete content by backspace key ([c52196e](https://github.com/lakejs/lake/commit/c52196e2dd3883e8830450caa3e9ca30af148bf8))
* **color picker:** check icon is not obvious in light colors ([a97113a](https://github.com/lakejs/lake/commit/a97113a5bfd56dd8da5086399dace671c590f244))
* **copy:** should not copy box when the cursor is on either side of the box ([54c4178](https://github.com/lakejs/lake/commit/54c4178b03ee0f0fc61edb08546354b0e4b5041b))
* **Core:** can input text in both strips of box ([29eea17](https://github.com/lakejs/lake/commit/29eea171784fc79aebe4ae56c9f32c5989af89ec))
* **Core:** input event should support composition ([c1eac27](https://github.com/lakejs/lake/commit/c1eac2701c5e0dc39073876d6e47230d49bcfd7f))
* **coverage:** lint error ([eb809f9](https://github.com/lakejs/lake/commit/eb809f9a6b1a2256efc227d7ae490d9abab559ec))
* **debounce:** should not invoke on the leading edge ([b1a106b](https://github.com/lakejs/lake/commit/b1a106bbb0236eebc524cb113f6629d92c8307a2))
* **delete-key:** should correctly merge two blocks that include only inline box ([080287f](https://github.com/lakejs/lake/commit/080287feddfef08263f0732c92a15c05a513f0f4))
* **delete-key:** should keep empty paragraph after removing all content ([85a5fe3](https://github.com/lakejs/lake/commit/85a5fe355a9bae952d7d7150339268e04b1b9a07))
* **deleteContents:** cannot delete content when the end of selection is at the beginning of next td ([e3fc9d0](https://github.com/lakejs/lake/commit/e3fc9d0f7adf8d5cbb44e8095e94d00d7ad66e65))
* **deleteContents:** merge blocks when only text is deleted ([26beee8](https://github.com/lakejs/lake/commit/26beee8fc1900d85ebc8d17dd9d46583f8175413))
* **deleteContents:** nodes should be merged after deleting contents ([5825812](https://github.com/lakejs/lake/commit/58258127cea58393966e260f0fc07dbd5328e2d8))
* **deleteContents:** should support box ([3cb0a53](https://github.com/lakejs/lake/commit/3cb0a53ec2378d844536610f28734f7213d5b182))
* **denormalizeValue:** should consider line break ([cd8d0f9](https://github.com/lakejs/lake/commit/cd8d0f9969d2e28ebb37fa9d21c3621a5b92f768))
* **dropdown:** has wrong direction ([25a5aa6](https://github.com/lakejs/lake/commit/25a5aa67a63febc3f8f7057ca95f3ea83ba86b97))
* **dropdown:** when button is on the far right, the menu is not fully displayed ([9c5dad4](https://github.com/lakejs/lake/commit/9c5dad4c04d193a9d041efae526608eafb615fc8))
* enhance input event; add undo / redo events to history ([f97b369](https://github.com/lakejs/lake/commit/f97b3694d8615b6f922c30f2ea3b0374151b7b79))
* **enter-key:** blockquote should become paragraph ([9f338eb](https://github.com/lakejs/lake/commit/9f338eb9617bc096fff68bd3d9e9288a5053bae9))
* **enter-key:** should not split table ([2d0dff7](https://github.com/lakejs/lake/commit/2d0dff71b48ab85f80a9094e507d3a969f51a06a))
* **enter-key:** throw an error when selecting a block ([7e24ea4](https://github.com/lakejs/lake/commit/7e24ea4adecf754a8ce5c5ebad1f117786c15802))
* **enter:** history sometimes doesn't save data ([74da497](https://github.com/lakejs/lake/commit/74da4972fe76e6364df437b99da8d73255f329d5))
* **enter:** numbered list has wrong start value ([f48ef97](https://github.com/lakejs/lake/commit/f48ef97ece11ca3f5f2b5363ff6d696ae93f952e))
* **enter:** should become paragraph when press enter key in the list ([131613f](https://github.com/lakejs/lake/commit/131613f54979ca74adb77b70a642865211ccb2cb))
* **enter:** should become unchecked state ([bbe24ab](https://github.com/lakejs/lake/commit/bbe24abc0048a235a8012d71411d98038640256f))
* **enter:** should create new line when there is no block ([abba44b](https://github.com/lakejs/lake/commit/abba44b7662f0e6c811c89a1985468d9889441e2))
* **enter:** should split correctly when the cursor is on the inline box ([9c60b52](https://github.com/lakejs/lake/commit/9c60b529e2f6302ad6097558dcb138891ae8d319))
* **enter:** should split ul or ol ([489d176](https://github.com/lakejs/lake/commit/489d176d43a86f98cc15386cbbf15a0fa94e3bcb))
* **enter:** throw an error when the cursor is outside the end of the box ([119c294](https://github.com/lakejs/lake/commit/119c294911346cc3eb547c67e1491be324f456b7))
* **fixNumberedList:** add start attribute to other blocks ([5ef9df7](https://github.com/lakejs/lake/commit/5ef9df7ad7abfd1c7b1229991b2db6b373136689))
* **fontFamily:** returns incorrect font-family when it is surrounded by double quotes ([8170d36](https://github.com/lakejs/lake/commit/8170d36f653879b0e40645c119f7819a6fdfb8b9))
* **formatPainter:** doesn't change the style of the cursor to painting mode ([67be1a3](https://github.com/lakejs/lake/commit/67be1a3a0ffba527ef1787513ece4127b71a5f21))
* **formatPainter:** should not paint link ([0339547](https://github.com/lakejs/lake/commit/0339547735ddb35c76bd11b1d30a56f03a79f29b))
* **formatPainter:** should not trigger saving history ([7ff3605](https://github.com/lakejs/lake/commit/7ff3605ef86800cb07adbaf3dc2b9856e0a03773))
* **getBlocks:** doesn't return ul or ol ([b5fbca8](https://github.com/lakejs/lake/commit/b5fbca8e231947ea875c15c7e32b02fc69e60408))
* **getTags:** cannot get next nested tags ([a1b1a50](https://github.com/lakejs/lake/commit/a1b1a50a5c714d2b8cffd78d3d248b82b536d93a))
* getWalker shouldn't iterate box node ([b9959a7](https://github.com/lakejs/lake/commit/b9959a73a67a28e4ab650e57aec9b4b181c2af43))
* hasEmptyText supports &NoBreak; ([0a6ecd6](https://github.com/lakejs/lake/commit/0a6ecd6ff1532f5fbacef100749ab51d37cf4c9c))
* history should not be saved when only changing selection ([acb2d38](https://github.com/lakejs/lake/commit/acb2d386258224811897d2de04b67cc5bb658840))
* **history:** after undoing, a box just inserted into between two other boxes does not re-render ([607a534](https://github.com/lakejs/lake/commit/607a5343175da0769e02a240f50625704d7364a4))
* **history:** doesn't render / remove descendant boxes ([ea7eda8](https://github.com/lakejs/lake/commit/ea7eda84fcb874cf8f8df8c0b04a8f0a7c9492ca))
* **history:** history.index doesn't decrease ([1c1c0e8](https://github.com/lakejs/lake/commit/1c1c0e8aef8303b121487f8b83bb41c101f55756))
* **history:** index should not become zero ([da4de40](https://github.com/lakejs/lake/commit/da4de409fe286de4007288e45a4cfe279b224036))
* **history:** index should not become zero (2) ([97a802a](https://github.com/lakejs/lake/commit/97a802a7e1a6d9da4bef9d5a776a99a0c7236d0e))
* **history:** returns invalid index  after undoing ([29f4e04](https://github.com/lakejs/lake/commit/29f4e040edf57d4580d696d6fdb5548dcfa563e2))
* **history:** saving history should not insert bookmark into content ([f69cddb](https://github.com/lakejs/lake/commit/f69cddb0092318cb9fa761c94417f255ba24e447))
* **history:** should save unsaved content ([2b572ec](https://github.com/lakejs/lake/commit/2b572ec76c3e0bd7fd78209a552657974c84fe02))
* **history:** undo/redo doesn't support box ([6b457c5](https://github.com/lakejs/lake/commit/6b457c5c436c1c0295a2abb91ac2d6d10b1d1257))
* **history:** update unmodified content when redoing ([70d9849](https://github.com/lakejs/lake/commit/70d98496b5c60ce03341f5bcb7daeb899f61f937))
* **hr:** should select the right side of the box after inserting hr ([beb8993](https://github.com/lakejs/lake/commit/beb8993224103e103e5f28ebf281d04fe6a0b97b))
* **HTMLParser:** improve getNodeList and getFragment ([5d3bcaa](https://github.com/lakejs/lake/commit/5d3bcaab5189e680df632d2e1a1f45145874a24a))
* **HTMLParser:** improve getTrimmedText ([3b42ed3](https://github.com/lakejs/lake/commit/3b42ed33b6a69aadc2ff190f138947cf3733fd1e))
* **HTMLParser:** should convert &nbsp; ([507110a](https://github.com/lakejs/lake/commit/507110adacd19281b9141a5ba70479dc8305d886))
* **HTMLParser:** should escape HTML entities ([e3a6fb6](https://github.com/lakejs/lake/commit/e3a6fb6e9f32060d250e669b8d8ffaf6fbaa00b1))
* **HTMLParser:** should not modify contents in the box ([fee5e19](https://github.com/lakejs/lake/commit/fee5e19971c0ed8f4743bdde1424d6e6bae53590))
* **HTMLParser:** should not remove &nbsp; ([e06960b](https://github.com/lakejs/lake/commit/e06960bc2074d933ea676b7abc7d9cac9d28ebc8))
* **HTMLParser:** should not trim space ([708efc6](https://github.com/lakejs/lake/commit/708efc6225acb961b3b39a58e1a30d61a7bc6c72))
* **HTMLParser:** should not trim text around inline element or box ([eaa5455](https://github.com/lakejs/lake/commit/eaa5455e1e68a9d58fe54212b496d15b4a795bec))
* **HTMLParser:** should remove comment ([b0ae393](https://github.com/lakejs/lake/commit/b0ae39307806a1ad0e0620e03bc95143b90dcc01))
* **HTMLParser:** trim content ([daaf2ee](https://github.com/lakejs/lake/commit/daaf2ee04167880fac17d22eabcb69ccdcc9e2ad))
* if the selection ends at the start of a block, the block should not be modified. ([a745d75](https://github.com/lakejs/lake/commit/a745d758ec60ea442c605cf306c165593e109e00))
* **image:** adapt width ([8e97e7b](https://github.com/lakejs/lake/commit/8e97e7b9c8782b25edafa96996772ca65bed0273))
* **image:** improve loading effect under slow network ([063b1d1](https://github.com/lakejs/lake/commit/063b1d1c58422d2a28eced047455c017fd63c508))
* **image:** improve ui for small size ([e8f24df](https://github.com/lakejs/lake/commit/e8f24df861bbefb2377afeaf37af494049b21579))
* **image:** lint error ([37b7237](https://github.com/lakejs/lake/commit/37b723730930e1709f05539cc6398a604b310fde))
* **image:** should abort http request when removing box ([7a2be02](https://github.com/lakejs/lake/commit/7a2be02616850175660305025cb9891b90bddc6a))
* **image:** should keep displaying local image after upload before finishing download ([31626ea](https://github.com/lakejs/lake/commit/31626ea39b6d3c2982a6051b6c4ebdaed968c900))
* **image:** show undefined when loading failed ([52b9224](https://github.com/lakejs/lake/commit/52b9224b9a575e9f9f4560dc28a0b0bcb1384c31))
* **image:** when opening full screen, dataSource should not include image with error or uploading status ([22ba614](https://github.com/lakejs/lake/commit/22ba614998799a1f00181839766142e9ddcb3824))
* improve history ([823f335](https://github.com/lakejs/lake/commit/823f335640ac2db092f983c3a64123e54dad9175))
* incorrect behavior after inserting composition text in the left or right strip of box ([b729353](https://github.com/lakejs/lake/commit/b729353b47851ddef7af3661ba14eee474af5c6d))
* incorrect behavior after selecting a box ([8ac4e6b](https://github.com/lakejs/lake/commit/8ac4e6bd385369b2e1cab54546c8b261b63327e9))
* incorrect position of range after insert contents ([da8c62f](https://github.com/lakejs/lake/commit/da8c62f1f48dc550fcfe24bacd7cf045de58b7d0))
* incorrect result when selecting a block and the beginning of next block ([1983125](https://github.com/lakejs/lake/commit/198312513c14f486e9e8faaf523bbd67903839e9))
* **indent:** should remove text-indent if margin-left doesn't exist when decrease indent ([7edb9d4](https://github.com/lakejs/lake/commit/7edb9d4a54fd8a1f9dec148f2cc893249b219e5e))
* **insertBox:** throw an error when the cursor is at the right of the box ([f613dbe](https://github.com/lakejs/lake/commit/f613dbec0ef11d0c49fae86e303337db3009fdd1))
* **insertFragment:** should support box ([402ccd0](https://github.com/lakejs/lake/commit/402ccd0f8f81543f3201393582d0a8f0492a2df2))
* **insertLink:** should not update url with empty href ([ecfe0e5](https://github.com/lakejs/lake/commit/ecfe0e5aadf999a42f5d2b9c651b541b86cd2177))
* **insertLink:** should surround all non-block nodes ([f03bf94](https://github.com/lakejs/lake/commit/f03bf940821c21f116585b4c924a7cb8baec1c0c))
* isEditable of Nodes supports text node ([2bb8f9b](https://github.com/lakejs/lake/commit/2bb8f9bdd530f0747440bca127778668cc339b1e))
* **link popup:** covered by other layers ([0ea3560](https://github.com/lakejs/lake/commit/0ea356028ac7476d5714f272ab5419bfaf9b9fad))
* **link popup:** improve positioning ([381bc26](https://github.com/lakejs/lake/commit/381bc2643f6f3b685d956c517aae7055976bd946))
* **LinkPopup:** incorrect positioning when the window is scrolled ([77dc9b9](https://github.com/lakejs/lake/commit/77dc9b924a4c5c0b6368f42556a850e082f09749))
* **link:** should not encode url; set default value to title when it is empty ([54fe76c](https://github.com/lakejs/lake/commit/54fe76cb4b04e556141e56bebed28187895069dc))
* **link:** should not remain br tag when target block is empty ([7c7f7e3](https://github.com/lakejs/lake/commit/7c7f7e3cea1e76c750f5ac99bc43fee676c60c83))
* **list:** bulleted list has no indent style ([74f3631](https://github.com/lakejs/lake/commit/74f36311c90ac3723e52b70377f43c58b3a6cc2c))
* **list:** bulleted list shows wrong marker after indentation ([577866c](https://github.com/lakejs/lake/commit/577866cde4bc97025261df0f0c92c9623093b558))
* **list:** can't click checklist ([bb19ab5](https://github.com/lakejs/lake/commit/bb19ab56f82a68219886a2bc48bd24743297080e))
* **list:** improve fixing start number ([ac0eecd](https://github.com/lakejs/lake/commit/ac0eecd30a2df7d3b72dcaa47310672542a56d41))
* **list:** indent attribute was removed when changing list type ([81bedc8](https://github.com/lakejs/lake/commit/81bedc80cc310931de014ddcc0e8a2eb7ac082ed))
* **list:** nested numbered list has incorrect number ([70ff2f2](https://github.com/lakejs/lake/commit/70ff2f21ef0c8b1d057a3e02366ed5cc6321c4aa))
* **list:** numbered list has incorrect item number ([5233e6c](https://github.com/lakejs/lake/commit/5233e6c936a2170c2cb8919a014aa255e104dc0a))
* **list:** pointer-events should use auto instead of all ([7fac304](https://github.com/lakejs/lake/commit/7fac304dfaa51397c0894e5c94d7e8eaca72f414))
* **list:** should put the checkbox at the start ([8e9b5ab](https://github.com/lakejs/lake/commit/8e9b5ab916f03fbb942a01cd11f883c4a1c1e7ef))
* **markdown shortcuts:** there is a delay after pressing space key ([7661e40](https://github.com/lakejs/lake/commit/7661e400a3e1fe1fcb4b20080b429606a213bec2))
* **markdown:** commit unsaved data before removing text ([53d1491](https://github.com/lakejs/lake/commit/53d1491283866963e9e04cf995d5a30bf3c64651))
* **markdown:** heading shortcuts do not append br for empty block ([93f938f](https://github.com/lakejs/lake/commit/93f938fc6c8709b65883bf021e2e2c186c83d45a))
* **markdown:** should have effect with empty mark ([6124fa9](https://github.com/lakejs/lake/commit/6124fa9e5fc4926453a88bf90699b8b573a268f6))
* **mergeNodes:** should remove br ([5672312](https://github.com/lakejs/lake/commit/5672312447708f51693c2a54ff52573aac8cfe15))
* **mergeNodes:** should support list ([944463b](https://github.com/lakejs/lake/commit/944463bf873133a3c3148d1ea344638b2f04dc0a))
* nodes.off() does not work ([a6290ed](https://github.com/lakejs/lake/commit/a6290edcfb3bd9d1fc0f43e282a02fced28252e1))
* **Nodes:** should trim \n ([bac8c5a](https://github.com/lakejs/lake/commit/bac8c5a14d3121e6f8e9db56ea8270cc996cbaf0))
* normalize text after remove bookmark ([835996e](https://github.com/lakejs/lake/commit/835996ee12ff59b41a2f2b9189ad04194ee2eca6))
* **operations:** deleteContents  should not split table ([3e39ab1](https://github.com/lakejs/lake/commit/3e39ab13834b42414039a39f95e4584ce7d532dd))
* **paste:** cannot paste content when the cursor is on the either strip of a box ([c2d60bb](https://github.com/lakejs/lake/commit/c2d60bbbb2b27b6daa301b335b6c8283740e961c))
* **paste:** cannot paste img and hr elements ([17380a3](https://github.com/lakejs/lake/commit/17380a312e2d59ace392a5a955b88e70b375dbe4))
* **paste:** control nested blocks ([989bb1a](https://github.com/lakejs/lake/commit/989bb1a21329b3f776d36d2ff74279a5fead558a))
* **paste:** fix clipboard data ([602f677](https://github.com/lakejs/lake/commit/602f6773b2630033f6ea41013925f5322dc18abd))
* **paste:** fix unsupported nested blocks ([4bff441](https://github.com/lakejs/lake/commit/4bff44180c17b9ff47c73e52c3463478622e45b9))
* **paste:** has unnecessary line ([742ae10](https://github.com/lakejs/lake/commit/742ae10f95325101b1bf2848880ae3d4ac36a841))
* **paste:** improve code ([4104c98](https://github.com/lakejs/lake/commit/4104c981c93cae262b02ef9e7026fa6795475193))
* **paste:** incorrectly pasted when the cursor is on the inline box ([c664197](https://github.com/lakejs/lake/commit/c664197315c44527e066f346fd2327001d5da927))
* **paste:** produce incorrect dom structure when box node contains block tag ([e8a4312](https://github.com/lakejs/lake/commit/e8a431200d375a20d06d3bb55d5b6965d68b2b99))
* **paste:** should keep original block ([3f74113](https://github.com/lakejs/lake/commit/3f7411328daafc7185c60297aa658bed5cbf98e2))
* **paste:** should not lose image info when copying inner image ([1099de5](https://github.com/lakejs/lake/commit/1099de592d484ab3301fcc8c5e9f9010a3f1846b))
* **paste:** should remove id and class ([40af26e](https://github.com/lakejs/lake/commit/40af26e418ebaecd173ec4094f4f7e030621ec2d))
* **paste:** throw an error when pasting box ([c9ee23c](https://github.com/lakejs/lake/commit/c9ee23c527da5909f385f5870f9c8f57ed1ec5e7))
* **paste:** wrong behavior ([9f74ac2](https://github.com/lakejs/lake/commit/9f74ac280ab8ca353bbc3d237f07c0647de58869))
* pasting adapts to box input ([bf4745d](https://github.com/lakejs/lake/commit/bf4745d109cec4b683aff35e50638f478870cbbb))
* **popup:** incorrect positioning when the editor has ancestor node that has relative property ([30a2f39](https://github.com/lakejs/lake/commit/30a2f3962f8b8793d9c82813bda2730e0d0fe682))
* **range:** improve selectAfterNodeContents ([c75a69e](https://github.com/lakejs/lake/commit/c75a69e7bce62cf001f2a9358996883b4ccde9a8))
* **Range:** reduce-type methods should support box ([ac98e6d](https://github.com/lakejs/lake/commit/ac98e6ddb1d64dd0aa071075d43253c900c16d8f))
* **Range:** shrinkBefore and shrinkAfter should return after a box was selected ([03d6aba](https://github.com/lakejs/lake/commit/03d6abad266a1d75181126fd6e3c76a3458e5801))
* **removeMark:** doesn't remove a mark when the focus is at the end of the mark ([8c292cc](https://github.com/lakejs/lake/commit/8c292cca054431e2be26e50ffff3948a8494e609))
* **removeMark:** incorrect behavior when cursor is on either side of box ([e62ebe9](https://github.com/lakejs/lake/commit/e62ebe9b2c6bf9b5d4e78b83477428a9b4afcc97))
* **removeMark:** should not remove link ([bd0692a](https://github.com/lakejs/lake/commit/bd0692a249841975e04f6084ac8937cd5aa81cf3))
* reset selection to focused box ([26ddf4e](https://github.com/lakejs/lake/commit/26ddf4ebf2c2e48201139d291b16f04b9add940e))
* **select-all:** shrink range after selecting all content; remove keystroke; ([968d942](https://github.com/lakejs/lake/commit/968d942d6abe87c721cce287904bcbd2ca1751ad))
* **setBlocks:** get wrong result when the selected content with inline-box are not in the block ([4e1fa87](https://github.com/lakejs/lake/commit/4e1fa878e2cf1583bf12f2ef166eb30f40e73ae8))
* **setBlocks:** incorrect behavior with box ([40d5573](https://github.com/lakejs/lake/commit/40d5573fc4a4002dbe77ab4665acde49c29aaa9a))
* **setBlocks:** should set attributes ([a72f53d](https://github.com/lakejs/lake/commit/a72f53da259b52334c3c3fc126cc52e53cd39964))
* **setBlocks:** supports changing to nested block ([759cef4](https://github.com/lakejs/lake/commit/759cef4da9e62ef105c03c96808dece0cab32ce9))
* **shift-enter-key:** remove box when the focus is center ([e4c4219](https://github.com/lakejs/lake/commit/e4c4219c3d4f9eb44f5c9bac638b9a54674f4505))
* **shift-enter-key:** should not produce zero width space ([39a98fa](https://github.com/lakejs/lake/commit/39a98faf39b2eb04765a529621a7b7ccc9c2f553))
* **shift-enter-key:** should not split td element ([3a21268](https://github.com/lakejs/lake/commit/3a212689df1b84427d6fa2f73c0565c596b65645))
* **shift-enter-key:** should produce br tag when the cursor is in the beginning or  end of inline box ([2d14091](https://github.com/lakejs/lake/commit/2d14091b4ec4b5e92acf02de4b15c6decac1fac8))
* shift+enter key adapts to box input ([847edeb](https://github.com/lakejs/lake/commit/847edeb82b72d9ad5b5791c8ade14245c5f6bd43))
* shoud not execute undo / redo of editor when the box was activated ([64fc6fc](https://github.com/lakejs/lake/commit/64fc6fca4792eeedfc937383d0720a8b7f114f04))
* should escape special characters in the template ([7a3f537](https://github.com/lakejs/lake/commit/7a3f53717cc8a39986052676fba9db830276ddfe))
* should not create popup element when initiating editor ([bf319a0](https://github.com/lakejs/lake/commit/bf319a08e7f9a661c7b37dc80edf658876e6f405))
* should not re-render boxes that were not modified ([7a3537f](https://github.com/lakejs/lake/commit/7a3537f6f12982a50dc95b84573b02b04b95d51f))
* should not trigger editor's input event when inputting in the textarea of the box ([8aa1ee3](https://github.com/lakejs/lake/commit/8aa1ee33b0e4ddc48a9c94bd5ef01161b2695922))
* should unbind click event after the box was re-rendered ([9c0b7e8](https://github.com/lakejs/lake/commit/9c0b7e84369202aad5a36a6c3bd3a104d25a219c))
* sometimes dirty box instances are not removed ([30b5fec](https://github.com/lakejs/lake/commit/30b5fece9dcd626120c2aa9222a25a5a4541d5be))
* **splitBlock:** shouldn't split inline box ([7fc2223](https://github.com/lakejs/lake/commit/7fc2223fd4e2ede35e7f097dd3d72959d726bc8a))
* **splitMarks:** shouldn't split inline box ([911f826](https://github.com/lakejs/lake/commit/911f826566bd6b16a19b4b90ffb26a32da2d8c52))
* **splitMarks:** split container ([8c0fb8e](https://github.com/lakejs/lake/commit/8c0fb8ef499c56e836cf83c0abab9ddd5c5bd88a))
* splitNodes produces empty text node ([2b7856d](https://github.com/lakejs/lake/commit/2b7856dc14a94c9b56bfa3b8e0c0b0e227d0da1a))
* **splitNodes:** incorrect behavior ([817ec8e](https://github.com/lakejs/lake/commit/817ec8e9cedfb0f2d29ab9fb0dc8436010e94690))
* **splitNodes:** should not split body when limitNode is incorrect ([8c3481b](https://github.com/lakejs/lake/commit/8c3481b57f339d53682ea63cf2d45dc56a08aa03))
* **tab-key:** incorrect behavior of about box ([565874a](https://github.com/lakejs/lake/commit/565874a7c61d3d8273923b00ae6846f58216d399))
* **table:** should not set or split table element ([3a7315a](https://github.com/lakejs/lake/commit/3a7315a62aa8ed2b29d85e47c3dfe10d8ea3632f))
* **tab:** should not add text-indent in non-paragraph ([86820c8](https://github.com/lakejs/lake/commit/86820c84d277f8eab6e2997bac18aa8d5be04274))
* **tests:** unable to close browser in console mode because of invalid src ([efaae37](https://github.com/lakejs/lake/commit/efaae37faf55923aa14a6dc312110b1f46f774a4))
* **test:** wrong box value ([6fa373c](https://github.com/lakejs/lake/commit/6fa373c8db8ba96f0626470ad63a4cb44f9eafe5))
* **TextParser:** should distinguish different numbers of new lines ([34f57df](https://github.com/lakejs/lake/commit/34f57df15067f829860fc0a7a83bfd134907b7a6))
* **TextParser:** should keep continuous normal space ([fcbe333](https://github.com/lakejs/lake/commit/fcbe33316949248a26819434bc556e149acaf18f))
* **toBookmark:** should not re-render when the box has already been rendered ([fb13d20](https://github.com/lakejs/lake/commit/fb13d206fab4574c72c6df45d71907679f0cef20))
* **toHex:** should support converting rgba to hex8 ([dd2b6b9](https://github.com/lakejs/lake/commit/dd2b6b939797c57a095a4a19f5afeee0b23f29fa))
* **toolbar:** can't wrap onto multiple lines ([7f38cf0](https://github.com/lakejs/lake/commit/7f38cf090aefd305803ead34b4f68e10f480a812))
* **toolbar:** doesn't update accent color when selecting a color ([029192e](https://github.com/lakejs/lake/commit/029192ef10d26af0d9c5daac076b5b365a997f5e))
* **toolbar:** doesn't update state of heading ([003d567](https://github.com/lakejs/lake/commit/003d567478ba049299f4da6b7e53d4061e8366ff))
* **toolbar:** fontSize should show integers ([3264d40](https://github.com/lakejs/lake/commit/3264d4024f4a4c58c7607d7c23c113990587a345))
* **toolbar:** should disable bold button when cursor is in heading ([4db0af2](https://github.com/lakejs/lake/commit/4db0af2917ad4ad1e6a5733a64215ee957caaee9))
* **toolbar:** should disable fontSize when selection is in heading ([1dddb65](https://github.com/lakejs/lake/commit/1dddb65f03ce38b858b0ad5c3b295fc1fbaa26c1))
* **toolbar:** should not remove current color in the button after removing color ([d7e6016](https://github.com/lakejs/lake/commit/d7e6016f64d4def10e0b62e289cf2615062f0644))
* **toolbar:** should show current font size when it doesn't exist in the menu items ([2fbb3ac](https://github.com/lakejs/lake/commit/2fbb3ac2410bbebdd79d72941ec71f08d0e8bf49))
* **toolbar:** should support direct clicking ([9b357c1](https://github.com/lakejs/lake/commit/9b357c1459e7051a8baafaf5ee0670c7aa80885a))
* **toolbar:** unable to show checked icon ([4f504f4](https://github.com/lakejs/lake/commit/4f504f478ea54f117666906ba221907f4e7c1115))
* **toolbar:** use accent icons for color items ([86f78c4](https://github.com/lakejs/lake/commit/86f78c48b374bf42601c86f7cadd86285364d1f5))
* **toolbar:** wrong name about superscript ([0b4e632](https://github.com/lakejs/lake/commit/0b4e6327e684fe962eccdca635ac3a8eca05043c))
* typo ([981c7ef](https://github.com/lakejs/lake/commit/981c7ef1881b2d2bf140be0be2d533ae192edde6))
* **uploadImage:** should show error image when  response body has no url field ([06f0cb1](https://github.com/lakejs/lake/commit/06f0cb11777413f59fc1d073b12d5607601cd771))
* **upload:** unable to select same files ([a09a995](https://github.com/lakejs/lake/commit/a09a995201e8edd508bed477a68d9d121d273efa))
* using throttled handler for updating selection style of box ([a1fb747](https://github.com/lakejs/lake/commit/a1fb7471a7c35e784873dec6df3139c1d5e7729b))
* using throttled handler for updating state of toolbar ([d0c0bbc](https://github.com/lakejs/lake/commit/d0c0bbce9f27f93d2505d34f8ea39dbd42b46838))
* when the editor has unsaved data, change event should be emitted before leaving the page ([cf2fd6e](https://github.com/lakejs/lake/commit/cf2fd6edb3c0bc25ef7736c58dd883a3456f1cfe))
* wrong range sometimes appeared after calling appendDeepest function ([b65ca8b](https://github.com/lakejs/lake/commit/b65ca8bb0ba05608de58933ff5a95b7e6cf221bd))


### Features

* add $mod+A shortcut ([580b195](https://github.com/lakejs/lake/commit/580b1953c3fe0c5562e2b3feff60c7638572f99e))
* add addMark operation ([9219826](https://github.com/lakejs/lake/commit/9219826bc7ce935df96420ed58afda11e5d9b277))
* add align plugin ([7364df6](https://github.com/lakejs/lake/commit/7364df6ab786f9a54fe0f4043ddb38a829efc2a4))
* add allChildNodes for Nodes; add allNodes for Range; ([25c0022](https://github.com/lakejs/lake/commit/25c0022cc46bbf482e4e170bb59d0980e367f8e8))
* add appendDeepest util ([dac2e5d](https://github.com/lakejs/lake/commit/dac2e5d8f0fdcbc25165c6161c7eaac798f95985))
* add appendTo to ElementList ([72c662d](https://github.com/lakejs/lake/commit/72c662d973c9cbcaf29e22710efc2b40afeb8f9e))
* add before, prependTo to Nodes; improve setBlocks ([d2e7f28](https://github.com/lakejs/lake/commit/d2e7f288b2c82919839aac80b1dea1a6d6d61048))
* add blockquote plugin ([fdf945f](https://github.com/lakejs/lake/commit/fdf945fd578bf3467d03a08e2466071807ea0f8c))
* add bookmark ([c6dadcb](https://github.com/lakejs/lake/commit/c6dadcba5e7352499eff5504bb08aa617490558c))
* add box-focused effect ([167b144](https://github.com/lakejs/lake/commit/167b144c4e1e978c3741163698248b97fed72f4e))
* add bulleted list ([bf4f790](https://github.com/lakejs/lake/commit/bf4f7904ab770b6ee367523bc984315fadc3066f))
* add change event ([508471b](https://github.com/lakejs/lake/commit/508471bb823460e1c2c3bec1bd2c5dbe62597a95))
* add class methods for ElementList ([530efc0](https://github.com/lakejs/lake/commit/530efc02cb1e487c6559cf861cd86f2baa76afda))
* add classes and types directories ([7e34c7a](https://github.com/lakejs/lake/commit/7e34c7a2cc0cadb36cf4855766dd25db7d5b651b))
* add closestBlock, isSibling to Nodes; add allTopBlocks, allSiblingBlocks to Range ([d2ae8c9](https://github.com/lakejs/lake/commit/d2ae8c98abe497ef8d64fa8e1722db93bdf55371))
* add Command class ([a14995c](https://github.com/lakejs/lake/commit/a14995cbaa01c3c87d75aec5a14e0f73df9c04b3))
* add commands ([efd1b5c](https://github.com/lakejs/lake/commit/efd1b5cbf6dc65306b30edb1f06ebd4b7cd7a7a1))
* add compareAfterPoint method for Range; improve toBookmark ([5baf532](https://github.com/lakejs/lake/commit/5baf532c6615eeb82644f2183a4db0d5891df121))
* add css method for ElementList ([59f6628](https://github.com/lakejs/lake/commit/59f66281c87679c0261f6a2f5019270f39bfd2d6))
* add custom tags for position of selection ([77cadbc](https://github.com/lakejs/lake/commit/77cadbc9b17c1f74ece7af8dc362ed35abaa3990))
* add debug ([4dbe6f8](https://github.com/lakejs/lake/commit/4dbe6f8ed54d06a1d78114f3049a2ea79feb376b))
* add deleteContents, splitBlock operation; implement  enter event; ([efc9794](https://github.com/lakejs/lake/commit/efc979435fa8738dbf7d9c576033f0b45c3ffaa3))
* add demo ([97be94a](https://github.com/lakejs/lake/commit/97be94ad0aeddcdec911346e1960bfd7474297d7))
* add denormalizeValue; improve test utils ([edf8ef2](https://github.com/lakejs/lake/commit/edf8ef26b6627c750f91c5ddc5e6a837b39adc0d))
* add diff ([190e683](https://github.com/lakejs/lake/commit/190e683f592f1d906c8f68550c44994cc26f9f69))
* add elements.hasAttr() ([376c2fd](https://github.com/lakejs/lake/commit/376c2fd05aab17c25af70a954e79673c5b47bde7))
* add elements.id(), elements.fire() ([31e3644](https://github.com/lakejs/lake/commit/31e36443c48a94b3992dc0993925fdd082840c0b))
* add first, last for Nodes; add setStart, setEnd for Range ([3c2dfe1](https://github.com/lakejs/lake/commit/3c2dfe11d38eac9cceb055239c5434cb3f40f1ca))
* add fontfamily plugin ([9ce7b8a](https://github.com/lakejs/lake/commit/9ce7b8a8864d677f9aae7a8b699d899af7dcd0ca))
* add fontSize, fontColor, highlight ([ec64d1e](https://github.com/lakejs/lake/commit/ec64d1ee8f6a69c9fff9b55c700986923b94e39e))
* add fragment model; add matches method to Nodes ([351b8e4](https://github.com/lakejs/lake/commit/351b8e48925699f5625aa3db5547265898809762))
* add getAll, empty to ElementList ([fe178e2](https://github.com/lakejs/lake/commit/fe178e2c10e0e2558ecc8ac1fa2d47f0ec04149d))
* add getFragment, html and append ([fa9c06b](https://github.com/lakejs/lake/commit/fa9c06b415baf90de609b5c10fc7413e25559a19))
* add getMarks, removeMark ([87bad46](https://github.com/lakejs/lake/commit/87bad468d4d8825f0b607a18d4b541451ee8df49))
* add getRightText method ([6b2d670](https://github.com/lakejs/lake/commit/6b2d67086e7efd076515fc647edac90956efe618))
* add getTags to operations ([989ebe3](https://github.com/lakejs/lake/commit/989ebe3adaff3dad406c5f03f152dcb40941262b))
* add getValue, remove method; add test case of heading plugin ([d6b737c](https://github.com/lakejs/lake/commit/d6b737cd3d2954a03817e0cd8b343909dc1b8fbf))
* add history including undo, redo ([ec45b1c](https://github.com/lakejs/lake/commit/ec45b1c51d64c21550028ccbe8b1aadcfa4428cc))
* add HTMLParser and paste plugin ([42349f9](https://github.com/lakejs/lake/commit/42349f96c09ae0f1b4016467c7f7a3b09f067190))
* add HTMLParser.getHTML() ([2f341ce](https://github.com/lakejs/lake/commit/2f341ce552b085717ced2f0b397324e661931b33))
* add indent plugin ([3e50c19](https://github.com/lakejs/lake/commit/3e50c1933e74c9b1863255979e7b65cc07036d8d))
* add isBlock, isMark, getAllCss, setBlocks etc. ([ff2d74d](https://github.com/lakejs/lake/commit/ff2d74d42e2a2af3493bc5ddf71fc8dbbd933e87))
* add isBookmark; add enter, shiftenter plugin ([872a20c](https://github.com/lakejs/lake/commit/872a20ca1cf464b28699e92ebb1a0b4208948291))
* add isContainer, closestContainer() to Nodes ([7b15b55](https://github.com/lakejs/lake/commit/7b15b5582e2f07c5514687c94e55891dca44de04))
* add isContentEditable; should not modify the outer nodes ([ed055b2](https://github.com/lakejs/lake/commit/ed055b2c2188e521dfb7b5487eda4f5fdffe1b5e))
* add isNodeInRange method to Range ([b4b6f89](https://github.com/lakejs/lake/commit/b4b6f89565c2bdd6c48a304dac5a726fa98ae212))
* add isVoid, children to Nodes; add reduce to Range ([4e8e69f](https://github.com/lakejs/lake/commit/4e8e69f4d9c04e719483171d3c193d83ddb596b6))
* add italic plugin ([3dc79e7](https://github.com/lakejs/lake/commit/3dc79e7a6b3c6ea4883ab17e64c248f0893221a2))
* add keyboard shortcuts ([b357fd9](https://github.com/lakejs/lake/commit/b357fd95909a8fff9c8ea6d7f2eb78c6061d4fc0))
* add keystroke ([4e715b4](https://github.com/lakejs/lake/commit/4e715b48037799404005ab45d47df1c4485b53be))
* add limit property to history ([5560bb7](https://github.com/lakejs/lake/commit/5560bb7e726b580cfc136a483236e31ce92e78c3))
* add link plugin ([c0ed9a4](https://github.com/lakejs/lake/commit/c0ed9a4a30e3f07e2084bd891de66456797ad8ac))
* add list plugin ([2f63823](https://github.com/lakejs/lake/commit/2f63823a048bc079b46721b41b5a57c641d9b667))
* add nodes class. update readme ([5019db8](https://github.com/lakejs/lake/commit/5019db84088ba2a096f14a11fafe81649eaa73be))
* add nodes.text(); fix bug of splitMarks ([ea1f561](https://github.com/lakejs/lake/commit/ea1f561807100c3c196a125c56b44564ffe6b532))
* add normalizeBookmark; add test utils ([5c68ce0](https://github.com/lakejs/lake/commit/5c68ce05e1b27556f7e944fecf1bcb1a7415cfb9))
* add parent(), isEditable to Nodes ([1381707](https://github.com/lakejs/lake/commit/13817073664d992ff2cc9db31c62893f7da24724))
* add pasting HTML ([2d70442](https://github.com/lakejs/lake/commit/2d7044241eb95aefad2c09dc818e2387183d898e))
* add prepend to ElementList ([df9a0e5](https://github.com/lakejs/lake/commit/df9a0e521bf50642d2d5cc9ded1d86ac8dd66059))
* add prev, next for Nodes ([36ce103](https://github.com/lakejs/lake/commit/36ce103eac0a27dcb9c7bae0775de28eb870d532))
* add query to utils; add remove to ElementList; rename classes to models ([2baca2f](https://github.com/lakejs/lake/commit/2baca2fadfcfcc7a32aa45b725e78048bcea8863))
* add Range; ElementList supports Text ([bfa70b0](https://github.com/lakejs/lake/commit/bfa70b0a1a525c0bc0769cd320a8756de6666949))
* add readonly mode ([2fa2efb](https://github.com/lakejs/lake/commit/2fa2efb55285ac8358a3d59afd0ad9f9e599b978))
* add removeFormat plugin ([3d1a8c8](https://github.com/lakejs/lake/commit/3d1a8c8c311ea5d13abccca194f86cf1b714bd8e))
* add replaceWith for Nodes ([e04ac5a](https://github.com/lakejs/lake/commit/e04ac5a9138af9f206a43c6363321307bbcd1f40))
* add schema rules ([9dc34e0](https://github.com/lakejs/lake/commit/9dc34e05473d0281a469a7010a4d95b6548dda85))
* add searchString ([2580d63](https://github.com/lakejs/lake/commit/2580d63b7c301442f8965f307d7b682597a80cfc))
* add selectAll plugin ([7444b99](https://github.com/lakejs/lake/commit/7444b99d180482f46b189877f25a9fb25f24d3c6))
* add Selection class, focus method of Nodes and LakeCore, etc. ([c18d9ec](https://github.com/lakejs/lake/commit/c18d9ec717e7260912a2785d5dc2f7974ae101b4))
* add selection.getBlocks(); add node.isHeading ([e4dc0a6](https://github.com/lakejs/lake/commit/e4dc0a69d3f86188569776f02fbcb6a6b0503215))
* add spellcheck option ([a9daffe](https://github.com/lakejs/lake/commit/a9daffe72918d3f75285723d6e136bd925fb2cdb))
* add splitMarks operation ([1296455](https://github.com/lakejs/lake/commit/129645563b8330aa4ba61098b6caed93511aca09))
* add strikethrough ([22bc30e](https://github.com/lakejs/lake/commit/22bc30e23d292630ab25dc3c2bea983b500eafea))
* add subscript, superscript, code ([7d7a264](https://github.com/lakejs/lake/commit/7d7a264efa74f5d9e86e31bdc33ba836adb79c0d))
* add TextParser class ([78f639f](https://github.com/lakejs/lake/commit/78f639f0e51269f7cbda803bfe3eeb4c1a8f948e))
* add toolbar ([f5cfb5a](https://github.com/lakejs/lake/commit/f5cfb5ab66e8d4c30a066a085e6309b05852ba9d))
* add underline ([a9ed4be](https://github.com/lakejs/lake/commit/a9ed4bee2903df2a7852bcc7bb063d4656ffa14c))
* add unlink plugin ([0067c0c](https://github.com/lakejs/lake/commit/0067c0ce95bddfa553741757d23645eb8969ad6d))
* add utils. remove hello code ([8538020](https://github.com/lakejs/lake/commit/85380209c749ae6f0330049c9b4f1f7e7bdfa31c))
* add utils.changeTagName() ([d6630f0](https://github.com/lakejs/lake/commit/d6630f05f664b177dd50c2f1de8a458b0ab15fa0))
* add utils.getDeepest() ([e98c678](https://github.com/lakejs/lake/commit/e98c6789f2c6988d8340138c5112ab846d12bc3a))
* add utils.mergeNodes() ([6beff01](https://github.com/lakejs/lake/commit/6beff01785f315050251dc2451ce1baee9933372))
* add utils.removeZWS() ([9e18724](https://github.com/lakejs/lake/commit/9e1872412965bb523be414f014c1a9435e5f04a1))
* add utils.splitNodes(); improve addMark ([b72c1bb](https://github.com/lakejs/lake/commit/b72c1bbec47234ef0824e1d7b30bfdf6e4ca0275))
* add utils.wrapNodeList() ([4278545](https://github.com/lakejs/lake/commit/4278545a6bb08a09d58e1c777b8117f1df6282c4))
* add wrapper for lake-container ([bd552ec](https://github.com/lakejs/lake/commit/bd552ec1750e350687243eae293b4c5e03d03cc8))
* **arrow-keys:** customize up and down keys ([9552aae](https://github.com/lakejs/lake/commit/9552aae3814fbe0ae61193b8dbd2991b310514e4))
* backspace supports figure ([fc04521](https://github.com/lakejs/lake/commit/fc0452169c9ae221adf7190d897b204859e8d8e0))
* **backspace:** implement plugin ([113b4cf](https://github.com/lakejs/lake/commit/113b4cf371d981f72bca1f765e633b858e812f3d))
* **backspace:** initiate ([1e417d3](https://github.com/lakejs/lake/commit/1e417d3cba18578d5a1a9e67d26a617f38a70475))
* bold supports toggle ([5f136f5](https://github.com/lakejs/lake/commit/5f136f5a3ecb7942cf4a5b70fa276a1747081201))
* box component supports event ([8f41a57](https://github.com/lakejs/lake/commit/8f41a57f94fbc71e7deae0181329142b5037b3d2))
* **box:** add box-hovered effect ([73291c1](https://github.com/lakejs/lake/commit/73291c169192a57df5c3cb416c7e19bacfa472ba))
* **box:** add getEditor method ([289c898](https://github.com/lakejs/lake/commit/289c898685508de2433584a9e0e9b24ee5ef73fb))
* **box:** add save method ([6e5b45c](https://github.com/lakejs/lake/commit/6e5b45c37bfec434ec8dd7762e3ed9ec59ca7e7b))
* **box:** add update/remove methods ([fb82846](https://github.com/lakejs/lake/commit/fb82846ec1f73a580f8c4fc698bcdb76d93b6072))
* **box:** add updateValue method ([110af0e](https://github.com/lakejs/lake/commit/110af0e66bdd33ab7e1c0ba1ff12dcc1073fa3d6))
* **box:** add useEffect method ([4a3616a](https://github.com/lakejs/lake/commit/4a3616aabb7c7ca8651fa68636a1b2278f7d0408))
* **box:** render method supports custom appending ([e9c18b5](https://github.com/lakejs/lake/commit/e9c18b54c0429bd49af5c7b62b210d15d38a0f69))
* **code-block:** able to indent with tab ([e8c0953](https://github.com/lakejs/lake/commit/e8c0953e5e6d82fa7b6a0b3564efa7994ddc50fb))
* **color picker:** add remove icon ([5c0fe2c](https://github.com/lakejs/lake/commit/5c0fe2cf4082a9ee46476c9e56d668b15ea31e62))
* **copy:** add plugin for copy and paste box ([0c96d83](https://github.com/lakejs/lake/commit/0c96d83c11b41ad8baa7404bf18766e4bcb693ac))
* **Core:** add methods about custom modifications ([9720aa9](https://github.com/lakejs/lake/commit/9720aa902fc7937990db26c39bce9ccd6d7c4f73))
* **Core:** add mouseover event ([8565889](https://github.com/lakejs/lake/commit/8565889f46d5cb6bd9821647c6ffac7cc027a71d))
* **core:** add mutation observer ([5110e58](https://github.com/lakejs/lake/commit/5110e587025161cf311a2f13bf75e99cb8b39f0c))
* **Core:** avoid export default ([b11ef60](https://github.com/lakejs/lake/commit/b11ef6079511c40e0020ccac8fa4f0a58f9e0f53))
* **cut:** support cutting box ([4fef0d3](https://github.com/lakejs/lake/commit/4fef0d30ab50d1d85350854553005561488038e0))
* **denormalizeValue:** support figure ([0d50ac9](https://github.com/lakejs/lake/commit/0d50ac91c97183133c506d1ce7bfb17143463941))
* **editor:** add getWidth method ([29598d9](https://github.com/lakejs/lake/commit/29598d920124a7bf9654644e13f2ac95e92723cd))
* **editor:** add lake-box-focused class ([629553c](https://github.com/lakejs/lake/commit/629553c9f9d7d697b3eda6bbb972f8eba8918ef7))
* enhance Range, insertContents etc. ([2c2fd3e](https://github.com/lakejs/lake/commit/2c2fd3eb0c22f59e28b7e08240d7935de46567bd))
* **enter:** support box ([e52177c](https://github.com/lakejs/lake/commit/e52177c3391592340ab1dc2ca8fdb8d03e61d095))
* **example:** add codemirror ([6d97dc9](https://github.com/lakejs/lake/commit/6d97dc93c372f9d7878af116583fb27fb9382a6a))
* **examples:** add full-featured editor ([e66a586](https://github.com/lakejs/lake/commit/e66a5867814376a7fa9e92796b1d729d1dfdacf5))
* export operation functions ([ee13ee6](https://github.com/lakejs/lake/commit/ee13ee6b6879e1d50b9841212596a30fd6c9e4dd))
* extract getCss, toHex from ElementList ([be0c023](https://github.com/lakejs/lake/commit/be0c0234acd652303ec69ee7b3289ccb30ce4589))
* extract tag names ([e07ef69](https://github.com/lakejs/lake/commit/e07ef69204cb086ffd0a069851f3a55ce5e257e5))
* **figure:** add style ([ae7d0bc](https://github.com/lakejs/lake/commit/ae7d0bc90c90a27e705dd5eb6a466ac0a6dfbe1c))
* **figure:** add updateFigure ([0bf1c94](https://github.com/lakejs/lake/commit/0bf1c949c2b8f19ae0bb3c5ea65a70c3ac87721c))
* **figure:** initiate dev ([7e47104](https://github.com/lakejs/lake/commit/7e471043b044a6ee1c31c35e8406f68b1b04f992))
* **formatPainter:** finished main coding ([e785b90](https://github.com/lakejs/lake/commit/e785b9023b8bf8a5bd81d1a4c92a3e655997d233))
* **formatPainter:** initiate code ([abfda3d](https://github.com/lakejs/lake/commit/abfda3dfa47dc534962bd16b15e752a3466a065c))
* getValue returns formatted value ([1d7c5c2](https://github.com/lakejs/lake/commit/1d7c5c2b32b8d5c7bc61b04e2fc1ab0c45a0a317))
* **history:** add event ([cf4668a](https://github.com/lakejs/lake/commit/cf4668a8e9830b4f4ddc1f7f93bad4194d12e17f))
* **history:** add pause and continue ([e088feb](https://github.com/lakejs/lake/commit/e088feb0cb7e0b1d172e44cf32be532436c728d4))
* **hr:** add plugin ([b3d117d](https://github.com/lakejs/lake/commit/b3d117dfb54bcf7ef99c8db4bbc94ba7d98b2879))
* **HTMLParser:** rules supports string and array ([58ce439](https://github.com/lakejs/lake/commit/58ce439becef5615f65868e1f25942b047f07b86))
* **image:** add original url, width and height to value of box ([103814c](https://github.com/lakejs/lake/commit/103814c479968f239962b37466b36a4c3434db40))
* **image:** add plugin ([1462030](https://github.com/lakejs/lake/commit/1462030c426b9420ab8587cc417dca56eeb11c58))
* **image:** add ui about resizer ([e3f11da](https://github.com/lakejs/lake/commit/e3f11da12c6825d47ab1886635cb3280bb68c6c9))
* **image:** add uploading / error status ([1b86b76](https://github.com/lakejs/lake/commit/1b86b7640d8aa3a6adcc389dd4f2d094a25276e1))
* **image:** add view / delete buttons ([142ddd2](https://github.com/lakejs/lake/commit/142ddd210b88ad75092f4f749cefafd4625342ea))
* **image:** add zoom buttons for full screen ([b8e9f24](https://github.com/lakejs/lake/commit/b8e9f2485307218bcf7eef64c04d71ac1a3d2b41))
* **image:** box supports percent param ([c73fe24](https://github.com/lakejs/lake/commit/c73fe24bfc05d92cfa65b5554f9a2b51555ab220))
* **image:** display placeholder when loading ([43e3e4d](https://github.com/lakejs/lake/commit/43e3e4d87a2a71edb0d1deef6ea006c9320c0e25))
* **image:** display size information when resizing ([9bc1af9](https://github.com/lakejs/lake/commit/9bc1af9203a8e47c044bccb5a60f0838e3238bf5))
* **image:** styling PhotoSwipe ([52441c2](https://github.com/lakejs/lake/commit/52441c2c6b9bf63144eb7883a297c4d891dc58a8))
* **image:** support resizing ([ab9f1d3](https://github.com/lakejs/lake/commit/ab9f1d3026fcd005d39389e5e96e2c18c415f8d2))
* **image:** use photoswipe to preview ([70b6003](https://github.com/lakejs/lake/commit/70b6003a5fc80de0b0944f4ca05a1f13ad4a482f))
* implement getBlocks, setBlocks ([6c44f6b](https://github.com/lakejs/lake/commit/6c44f6b315c82eb2aaa292b13c00acc7d4350dd5))
* implement shift+enter event ([269b11d](https://github.com/lakejs/lake/commit/269b11d77c8f963e6b8aaa21174d6b5aa11a96ad))
* improve addMark ([7410b18](https://github.com/lakejs/lake/commit/7410b181235098c7a6a2d5c6192d72d70df927e7))
* improve addMark ([b8956e3](https://github.com/lakejs/lake/commit/b8956e3f2e2d26bd29bdd13bb196e3be82e4bd02))
* improve getBlocks, setBlocks ([dd2e8da](https://github.com/lakejs/lake/commit/dd2e8da20039ee0f966f082454ce947659e196ae))
* improve getNodeList method of HTMLParser ([deafb4e](https://github.com/lakejs/lake/commit/deafb4e8e17550d3f98f304f360529a563f41b34))
* improve splitMarks; add splitText, index to Nodes; add compareBeforeNode to Range ([1ccfaab](https://github.com/lakejs/lake/commit/1ccfaabd2fafee591ac617c2b43bc03f74e8818f))
* initiate codeBlock plugin ([b113861](https://github.com/lakejs/lake/commit/b113861b82208dd1ebacbf5b5c279e616e45f7ed))
* **link:** add popup ([ee030d7](https://github.com/lakejs/lake/commit/ee030d7f0fe0ccafd406be1049d32d6d93f354a3))
* **link:** improve behavior of popup ([43a4bda](https://github.com/lakejs/lake/commit/43a4bdaa71e08db2da636a176ba58ebc8f7a3e14))
* **LinkPopup:** add save button ([90d17aa](https://github.com/lakejs/lake/commit/90d17aa960b330adcd06d2d8b162cfc2ff78bf6d))
* **link:** show popup by clicking link instead of mouseover ([36206a0](https://github.com/lakejs/lake/commit/36206a0b9499276520eadd8167be385408557297))
* **link:** support copy ([8718cff](https://github.com/lakejs/lake/commit/8718cff8c8f5a614d86270683dab4de7483ae106))
* **link:** supports opening link in new tab ([5f2f368](https://github.com/lakejs/lake/commit/5f2f3682c509ca1a3e833ab1fd830146e03be5cb))
* **list:** add checklist ([6433ae1](https://github.com/lakejs/lake/commit/6433ae1412a0bc260b7f71ce49b21965b36dce75))
* **list:** add indent attribute ([bd928c3](https://github.com/lakejs/lake/commit/bd928c34804213f24459f65f81532f578dbb799f))
* **list:** use indent attribute ([35efd68](https://github.com/lakejs/lake/commit/35efd687c276079a8bd74d114f997e4eea1f4025))
* **markdown:** add blockquote ([f6f25a3](https://github.com/lakejs/lake/commit/f6f25a3d6281219d52593b8e56751c8ba35cbce0))
* **markdown:** add list hotkeys ([2215326](https://github.com/lakejs/lake/commit/22153264eca048bbbd7de633a2d9386753852ad2))
* **markdown:** code refactoring about block hotkeys ([035d8a2](https://github.com/lakejs/lake/commit/035d8a292e4fab04d031a010b8c767d42e1ef95f))
* **markdown:** complete marks ([04a608d](https://github.com/lakejs/lake/commit/04a608dda274fc72a242746a76f3cddcb2148e88))
* **markdown:** finished heading ([79064bc](https://github.com/lakejs/lake/commit/79064bc0e198850f191facaa2c51ecb7c7a5683b))
* **markdown:** initiate hotkeys ([ed8b508](https://github.com/lakejs/lake/commit/ed8b508072c890a84f4bfae31c5c12c40b01a9f6))
* **markdown:** support bold ([b7dc305](https://github.com/lakejs/lake/commit/b7dc30526fdc0fd0d30a71e50456f1ade654cd3e))
* **models/box:** add container property ([928c9d9](https://github.com/lakejs/lake/commit/928c9d9d3bbdd22116b9bda18e56308d96f7e91c))
* **models/box:** parameter supports native node ([282fc18](https://github.com/lakejs/lake/commit/282fc187bbf4cff03d6b04248adfb5445d944f41))
* **Nodes:** add closestOperableBlock() ([892918f](https://github.com/lakejs/lake/commit/892918f4980bffb75d0145a6e8a066f49070367b))
* **Nodes:** add inFigure ([e52f41b](https://github.com/lakejs/lake/commit/e52f41b27e5295e96a1a2903e03489a00541c12e))
* **nodes:** add isIndivisible property ([31faf51](https://github.com/lakejs/lake/commit/31faf51516ce9f863bd8fc8b4b5fe393d57bab46))
* **Nodes:** add isInlineBox / isBlockBox methods ([5d5899b](https://github.com/lakejs/lake/commit/5d5899bfbf397466a728430e7e16d9e04a0510ba))
* **nodes:** add isTable property ([b806e31](https://github.com/lakejs/lake/commit/b806e3109abec8d6bdc32eeab58fbc38edde698d))
* **Nodes:** add path method; find method supports path ([33c08ce](https://github.com/lakejs/lake/commit/33c08ce1dc1bfc0a73dab1827456cccadf17481c))
* **Nodes:** add text(value) method; escape every variable of template for safety ([c9e1ccc](https://github.com/lakejs/lake/commit/c9e1ccc0924386e6465e2ca695ba4c6c66c9b052))
* **Nodes:** add width / height method ([5d814c6](https://github.com/lakejs/lake/commit/5d814c65cdfb315d90d7261c923cbf5f0fad4a49))
* **Nodes:** emit method supports event parameter ([19306f6](https://github.com/lakejs/lake/commit/19306f666418592bd9f8a23ea14d49a39e351a80))
* **Nodes:** remove default value of get method ([39479ed](https://github.com/lakejs/lake/commit/39479ed0c69b43f3b6b9964b80dc19e92acd6a03))
* **operations:** add insertLink ([62c5e9f](https://github.com/lakejs/lake/commit/62c5e9f6084dbf21ff9fef66a79dcda9c752164f))
* **operations:** add insertNode ([461e178](https://github.com/lakejs/lake/commit/461e17819709aef75ceac527d68f4cee0b3fa0a9))
* **operations:** add removeBox ([05ac274](https://github.com/lakejs/lake/commit/05ac2746c7c860ceedea8dab0f1810a3d8d99305))
* **paste:** finish pasting plain text ([8ffa09f](https://github.com/lakejs/lake/commit/8ffa09fc27ce94331c51933b325a11fef23a3536))
* pastes plain text into empty content ([fb7bf83](https://github.com/lakejs/lake/commit/fb7bf83814f37640a39d332af96c89953e1be6e2))
* **paste:** supports plain text ([081b289](https://github.com/lakejs/lake/commit/081b289259ddcd68c77216471ae416b830d93706))
* **plugin:** add arrow-keys ([7dd53fc](https://github.com/lakejs/lake/commit/7dd53fc717f9e01012eb8f50520cb9179b199cca))
* **plugin:** add delete-key ([5c1f910](https://github.com/lakejs/lake/commit/5c1f91045119b9c663b8564348a78a44d4ded448))
* **range:** add adaptTable method ([b4abc9b](https://github.com/lakejs/lake/commit/b4abc9b5f35e645ee02baef0838001369f9ed03c))
* **Range:** add getBoxes method ([72054ff](https://github.com/lakejs/lake/commit/72054ff4150e1459c728d2e26e6ab7530a4f6d2a))
* **Range:** add selectBoxLeft and selectBoxRight ([91371c2](https://github.com/lakejs/lake/commit/91371c2e0361b43de4f1fd81fafdbf59176e2399))
* **Range:** extract methods(isBoxLeft, isBoxRight, adapt) from plugins to Range ([a700e2a](https://github.com/lakejs/lake/commit/a700e2a61fd7c1a8179250b2d881b437c8eb33a2))
* **Range:** rename method from isBoxCenter to isInsideBox; add a new isBoxCenter method ([cb95a75](https://github.com/lakejs/lake/commit/cb95a75f9f705f82a4873a440ad5b65a45db50c0))
* remove appendTo, prependTo ([825c0d5](https://github.com/lakejs/lake/commit/825c0d5950af01b68ed1a49afb4d9a864166c50b))
* remove doc and win properties ([6d74901](https://github.com/lakejs/lake/commit/6d749012a36382faef763c0ec2f6be983514cd8b))
* remove lake-box-no-focus ([0fd82b8](https://github.com/lakejs/lake/commit/0fd82b83b065fa2acc905a5b39866d6fe623cbb7))
* removeMark can remove all marks ([8bdae57](https://github.com/lakejs/lake/commit/8bdae57d30f4d957bc27f43086648afe332caeec))
* rename custom events; remove unnecessary events ([984ea40](https://github.com/lakejs/lake/commit/984ea40004d8708b3b1759555cb93a6b010d8877))
* rename get() to eq(); add new get() ([c26ea80](https://github.com/lakejs/lake/commit/c26ea80b579c05bb8f4d5b92985fb80b9c83d1b5))
* rename nodes to elements. add attr, removeAttr and forEach etc. ([e78ff35](https://github.com/lakejs/lake/commit/e78ff353a2c6cd9c3eef99368c46429b24b04ef0))
* render all boxes after the value was set ([ea6ae93](https://github.com/lakejs/lake/commit/ea6ae933c15dbb38e48179b86325c78513a8c660))
* **request:** use sinon to test xhr; rename upload to request; ([5f7eb6f](https://github.com/lakejs/lake/commit/5f7eb6f20af038d6114a29c8f33be85eb2e8a5b9))
* sanitize html ([981b3e6](https://github.com/lakejs/lake/commit/981b3e6cf2244f6d9ccaf35b4052d44dcf799fef))
* **schema:** blockquote supports type ([6fa019f](https://github.com/lakejs/lake/commit/6fa019fdb86a3273ff26fb4a8156109459bb67fd))
* **schema:** supports text indent ([0bd9dd8](https://github.com/lakejs/lake/commit/0bd9dd8097879bbb793722f34a02967b7d1c05e7))
* **selection:** add getLeftText method ([c7d0529](https://github.com/lakejs/lake/commit/c7d0529162f29582e0ce364d7837f1630637746f))
* **selection:** add removeBox method ([33244f2](https://github.com/lakejs/lake/commit/33244f2af8d40ec288517ea4e04c032c96796872))
* shorten shortcut key expressions ([356b113](https://github.com/lakejs/lake/commit/356b113d7de21af6b2ddfc2cd61e02718777bf56))
* simplify render parameters ([505215f](https://github.com/lakejs/lake/commit/505215fe8eb2f7642eec337d6a7583f7e5dd51f0))
* **style:** add blockquote style ([255829c](https://github.com/lakejs/lake/commit/255829c40e0cced074bc0fe1ad9ae82e39125e82))
* **style:** add heading ([0aa3b5c](https://github.com/lakejs/lake/commit/0aa3b5c98202ce77a83244af041ce9d9904dea1c))
* support document fragment ([84f5100](https://github.com/lakejs/lake/commit/84f51005d4e788a8e519a1b0f60bac636131be5c))
* support table  tags ([f200c28](https://github.com/lakejs/lake/commit/f200c287209092aca2e7560ff119c0d8572d0da5))
* **tab:** add tab event ([c2565b8](https://github.com/lakejs/lake/commit/c2565b808228221c130ae485fbb63090b0b2934c))
* **table:** extract style to css file ([0c12cc1](https://github.com/lakejs/lake/commit/0c12cc1a3f778dfe64a894b91df2295ef677a10d))
* **table:** simplifies tags ([e80c6fa](https://github.com/lakejs/lake/commit/e80c6fa4df6fdb85855567302d4f48d5e71a33b8))
* **test:** add box cases ([0b062fc](https://github.com/lakejs/lake/commit/0b062fc361cd4e300344ba16c7310c3aa70ea7c6))
* **toolbar:** add align item ([9c4fa28](https://github.com/lakejs/lake/commit/9c4fa2841b4dd75de888f8787494700c42750b2d))
* **toolbar:** add blockQuote, hr, codeBlock ([532a536](https://github.com/lakejs/lake/commit/532a536608826c1bc5e53cded6b81147e52d13c8))
* **toolbar:** add color items ([01ba298](https://github.com/lakejs/lake/commit/01ba298c219a8c604289bfa4add0fa0072169fd2))
* **toolbar:** add fontFamily ([8186f8f](https://github.com/lakejs/lake/commit/8186f8f7d0c1becbd1661972875eda728667b142))
* **toolbar:** add fontSize ([fdea604](https://github.com/lakejs/lake/commit/fdea604bd8ed77c8a8b374ea2bec9079c82877db))
* **toolbar:** add getValue for dropdown ([ec987b7](https://github.com/lakejs/lake/commit/ec987b762b56f819d65fe7a786e2d80eaf0aa7a4))
* **toolbar:** add indent item ([6e02c53](https://github.com/lakejs/lake/commit/6e02c53f623b76e0320b806786f9ad534cdc4036))
* **toolbar:** add list item ([0348a7a](https://github.com/lakejs/lake/commit/0348a7af8dab56381361ec693e9ceec6f49676bc))
* **toolbar:** add more icon ([f44bd46](https://github.com/lakejs/lake/commit/f44bd46d82e365e76554c2e625611d9b3aefa5eb))
* **toolbar:** add moreStyle icon ([5ff5b02](https://github.com/lakejs/lake/commit/5ff5b0289c997363dd65d24420b6103b9f9cd4b0))
* **toolbar:** add paragraph ([1091aa4](https://github.com/lakejs/lake/commit/1091aa4cc74b933e3aab5e3d045fbe3ffbee5bdf))
* **toolbar:** add superscript, subscript ([b58a6ab](https://github.com/lakejs/lake/commit/b58a6abfca0456626b43d12a512f63c25c56771b))
* **toolbar:** add undatestate event ([a5d0577](https://github.com/lakejs/lake/commit/a5d05772d088509761b66d47c7efce3648a6aa2e))
* **toolbar:** add upload type ([ce2c3a0](https://github.com/lakejs/lake/commit/ce2c3a09c13e336ed35dfaf7ff82b3974987a916))
* **toolbar:** change block-quote.svg ([58c47f5](https://github.com/lakejs/lake/commit/58c47f5299d31e7004aa7d10ac1e4bf928e530fd))
* **toolbar:** change style ([5229cdd](https://github.com/lakejs/lake/commit/5229cddbc83526507494e443d33416de59a41279))
* **toolbar:** config supports ToolbarItem type ([f311651](https://github.com/lakejs/lake/commit/f311651689dd36664770fdb87537504a92815225))
* **toolbar:** enhance color table ([2e1472b](https://github.com/lakejs/lake/commit/2e1472b7b1c2ceff2306bfeacff164b558b325ef))
* **toolbar:** finish heading ([597863c](https://github.com/lakejs/lake/commit/597863c05e706e126c6a919b39535816df337e34))
* **toolbar:** finish more style ([639b16a](https://github.com/lakejs/lake/commit/639b16a2c471afb4e8e094a170559e90d1900565))
* **toolbar:** move italic, underlint to more style ([580500d](https://github.com/lakejs/lake/commit/580500dd06c2ccb1794e53ed2a87a93c0761a58d))
* **toolbar:** supports disabling item ([ebd5251](https://github.com/lakejs/lake/commit/ebd5251fc3020da52ae3d5434616dcc46841c553))
* **toolbar:** supports showing selected effect ([79494d7](https://github.com/lakejs/lake/commit/79494d7e44effc38e56e349eb50310d184129499))
* **toolbar:** update icons ([e440430](https://github.com/lakejs/lake/commit/e440430e6cbb950a07b421093725237f07c6df28))
* **upload:** upload image to server after pasting ([7fa8a9a](https://github.com/lakejs/lake/commit/7fa8a9a39a35b82b81c422d163f4d8af35c2edc1))
* use Module class to load heading module ([85cbf57](https://github.com/lakejs/lake/commit/85cbf57c8acea32e79f721a770dc4b0ad0893573))
* **utils:** add removeBr ([6fef910](https://github.com/lakejs/lake/commit/6fef910501d912020f726c79737b6c085698909f))
* **utils:** add upload function ([188a619](https://github.com/lakejs/lake/commit/188a619dd4d01835cd3c85007dda32c416ba9e00))



