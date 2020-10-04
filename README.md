# Spark Logger
Spark Logger is a Chrome extension for easier and more efficient food tracking on [Sparkpeople.com](https://www.sparkpeople.com).

The extension acts as an alternative to the *Favorites* tab, which only allows food to be logged one at a time, and enables simultaneous logging of multiple foods.

## Features
- Simultaneous multi-entry logging
- Live cross-checking of favorites
    - :question:: no matching food in favorites
    - :exclamation:: food has multiple matches in favorites
    - :white_check_mark:: all good!
### Upcoming
- Specifying units
- :white_check_mark: replaced by emoji of food

## Usage
1. Visit https://www.sparkpeople.com/myspark/nutrition.asp (A Sparkpeople account is required)
2. Click the extension icon
3. Enter food name followed by amount (the unit defaults to grams), then hit **Enter** 
    * Multiple entries can also be pasted in (each entry must be on a separate line)
4. Click the **Log entries!** button to find and log the foods in favorites

## Installation
 :construction: *Version 1.0 is currently under development, but is scheduled for publishing to the Chrome Web Store in October 2020*

## Development
1. Clone this repo
2. In the cloned repo's root directory run `npm install`
3. Run `npm run dev`
4. In Chrome, use the address bar to navigate to chrome://extensions/
5. Click *Load unpacked*
6. Locate the cloned repo and select the *dist* directory in root

*:bulb: Hint: be sure to reload the extension from chrome://extensions/ and then the Sparkpeople web page in order for source code modifications to take effect*

### Tests
Parser tests can be executed by running `npm run test`

## Notice of Non-Affiliation and Disclaimer
Spark Logger is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Sparkpeople, Inc, or any of its subsidiaries or its affiliates.
The name Sparkpeople as well as related names, marks, emblems and images are registered trademarks of their respective owners.