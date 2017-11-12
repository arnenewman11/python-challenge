
import os
import csv

#define the file of interest
file = 'budget_data_2.csv'

#Define file path
csvpath = os.path.join('../PyBank', file)

#Pull in the csv file
with open(csvpath, newline='') as PyBank_csv:

	#Specify delimiter, name variable to hold contents
	PyBank_read = csv.reader(PyBank_csv, delimiter=",")

	#define months and revenue as variables and start at 0
	months = 0
	total_revenue = 0
	max_revenue_inc = 0
	max_revenue_dec = 0

	#skip the header row
	next(PyBank_read)

	for row in PyBank_read:
		
		#set counter for number of months
		months = months + 1

		#set monthly revenue
		month_revenue = int(row[1])

		#determine total revenue
		total_revenue = total_revenue + month_revenue

		#conditional to determine revenue increase and decrease, plus call the month
		if month_revenue > max_revenue_inc:
			max_revenue_inc = month_revenue
			revenue_inc_mo = row[0]

		if month_revenue < max_revenue_dec:
			max_revenue_dec = month_revenue
			revenue_dec_mo = row[0]

	#calculate average monthly revenue
	avg_revenue = total_revenue / months

	print("Financial Analysis")
	print("Total Months: " + str(months))
	print("Total Revenue: $" + str(total_revenue))		
	print("Average Revenue Change: $" + str(round(avg_revenue,0)))
	print("Greatest Increase in Revenue: " + str(revenue_inc_mo) + " ($" + str(max_revenue_inc) + ")")
	print("Greatest Decrease in Revenue: " + str(revenue_dec_mo) + " ($" + str(max_revenue_dec) + ")")

	# Set variable for output file
	output_file = os.path.join("PyBank_results.txt")

	
	#  Open the output file
	with open(output_file, "w", newline="") as textfile:
   	
   		textfile.write("Financial Analysis\r\n" + "Total Months: " + str(months))
   		textfile.write("\r\nAverage Revenue Change: $" + str(total_revenue) + 
   		"\r\nAverage Revenue Change: $" + str(round(avg_revenue,0)) + 
   		"\r\nGreatest Increase in Revenue: " + str(revenue_inc_mo) + " ($" + str(max_revenue_inc) + ")" +
   		"\r\nGreatest Decrease in Revenue: " + str(revenue_dec_mo) + " ($" + str(max_revenue_dec) + ")")
 
  