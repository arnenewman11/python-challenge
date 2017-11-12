import os
import csv

#define the file of interest
file = 'election_data_2.csv'

#Define file path
csvpath = os.path.join('../PyPoll', file)

# Set variable for output file
output_file = os.path.join("PyPoll_results.txt")

#Set winner variable
highest_votes = 0

#Winner name
winner_name = "Undecided"

#  Open the output file
with open(output_file, "w", newline="") as textfile:

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

		#print in terminal and write to text file
		print("Election Results\n")
		textfile.write("Election Results\r\n")

		#print to terminal and write to text file
		print("Total Votes: " + str(voter_count))
		textfile.write("Total Votes: " + str(voter_count) + "\r\n")

		for candidate_name, votes in candidates.items():

			#identify winner
			if int(votes) > int(highest_votes):
				highest_votes = int(votes)
				winner_name = str(candidate_name)

			else: highest_votes = highest_votes
			winner_name = winner_name

			#print candidate name and vote total 
			print(str(candidate_name) + ": " + str(round(int(votes) / voter_count,3) * 100) + "%, " + str(votes))
			textfile.write(str(candidate_name) + ": " + str(round(int(votes) / voter_count,3) * 100) + "%, " + str(votes) + "\r\n")

		print("Winner: " + str(winner_name))
		textfile.write("Winner: " + str(winner_name))

	
   	
   		#textfile.write("Financial Analysis\r\n" + "Total Months: " + str(months))
   		#textfile.write("\r\nAverage Revenue Change: $" + str(total_revenue) + 
   		#"\r\nAverage Revenue Change: $" + str(round(avg_revenue,0)) + 
   		#"\r\nGreatest Increase in Revenue: " + str(revenue_inc_mo) + " ($" + str(max_revenue_inc) + ")" +
   		#"\r\nGreatest Decrease in Revenue: " + str(revenue_dec_mo) + " ($" + str(max_revenue_dec) + ")")	


