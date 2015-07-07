# SPRjson v 1.0

This is a JSON wrapper for the Malaysian Government's Elections Commision Voter Registration site. Demo is here: sprjson.herokuapp.com

Given an IC number (old or new) at the API endpoint http://sprjson.herokuapp.com/ic/<insert IC number here>, the API returns a JSON object of the current results page of the website.

Future features:

[ ] Convert current birthdate field to a ISODate object
[ ] Add regex capability to reduce complexity in the Locality/DUN/Parliament levels.