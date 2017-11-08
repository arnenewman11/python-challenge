import os
import csv

#define the file of interest
file = 'election_data_2.csv'

#Define file path
csvpath = os.path.join('../PyPoll', file)

#Pull in the csv file
with open(csvpath, newline='') as PyPoll_csv:

	#Specify delimiter, name variable to hold contents
	PyPoll_read = csv.reader(PyPoll_csv, delimiter=",")

	#start voter count
	voter_count = 0

	#setup candidate list
	candidates = {}

	#skip the header row
	next(PyPoll_read)

	for voter in PyPoll_read:

		#Setup vote counter
		voter_count = voter_count + 1

		#name of candidate selected
		candidate_name = voter[2]		

		#Determine if the candidate is in the list already
		if candidate_name in candidates:
			candidates[candidate_name] = candidates[candidate_name] + 1
			
		else: candidates[candidate_name] = 1

	print("Total Votes: " + str(voter_count))

	for candidate_name, votes in candidates.items():

		#candidate_perc = round(votes / voter_count,0) 

		#print candidate name and votal 
		print(str(candidate_name) + ": " + str(round(int(votes) / voter_count,2) * 100) + "%, " + str(votes))


	


