# SPRjson v 1.0.1

This is a JSON wrapper for the Malaysian Government's Elections Commision Voter Registration site. [Demo](https://sprjson.herokuapp.com)

## Guide
Given an IC number (old or new) at the API endpoint `https://sprjson.herokuapp.com/ic/<insert IC number here>`, the API returns a JSON object of the current results page of the website. Both old and new IC numbers are currently supported.

Future features:

- [x] Convert current birthdate field to a ISODate object
- [x] Add regex capability to reduce complexity in the Locality/DUN/Parliament levels.