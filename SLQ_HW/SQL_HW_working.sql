USE sakila;

-- 1a. Display the first and last names of all actors from the table actor

SELECT first_name, last_name FROM actor;

-- 1b.  Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name

ALTER TABLE actor 
DROP COLUMN Actor_Name; -- only needed after initial add; drop column if exists is actually more complex code than drop DB
ALTER TABLE actor ADD Actor_Name VARCHAR(30); 
UPDATE actor SET Actor_Name = CONCAT(first_name, ' ', last_name); 

SELECT * FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
SELECT actor_id, first_name, last_name FROM actor
WHERE first_name = 'Joe';

-- 2b. Find all actors whose last name contain the letters GEN:
SELECT * FROM actor
WHERE last_name LIKE '%GEN%';

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT * FROM actor 
WHERE last_name LIKE '%LI%'
ORDER BY last_name, first_name; 

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
SELECT country_id, country 
FROM country 
WHERE country IN(
	SELECT country
    FROM country
    WHERE country = 'Afghanistan' OR country ='Bangladesh' OR country = 'China');
    
-- 3a. Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
ALTER TABLE actor
ADD COLUMN middle_name VARCHAR(50) AFTER first_name;
SELECT * FROM actor;

-- 3b. You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
ALTER TABLE actor 
MODIFY COLUMN middle_name TEXT;

-- 3c. Now delete the middle_name column.
ALTER TABLE actor
DROP COLUMN middle_name;

-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(*) AS `num`
FROM actor 
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT last_name, COUNT(*) AS `num`
FROM actor 
GROUP BY last_name
HAVING COUNT(*) > 1 ;

-- 4c. Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. 
-- Write a query to fix the record.
UPDATE actor
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO'
AND last_name = 'WILLIAMS';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor 
-- is currently HARPO, change it to GROUCHO. Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. 
-- BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)

UPDATE actor SET first_name = CASE
	WHEN first_name = 'Groucho' THEN 'Mucho Groucho' 
	WHEN first_name = 'Harpo' THEN 'Groucho'
    ELSE first_name
    END; 

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?

-- mysqldump -u newman.arne@gmail.com -p sakila <path/address.sql -- Is this what it is asking?

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT staff.first_name, staff.last_name, address.address
FROM 
	staff
    INNER JOIN
    address
    ON (staff.address_id = address.address_id);

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT staff.first_name, staff.last_name, SUM(payment.amount) AS total_payment
FROM 
	staff
    INNER JOIN
    payment
    ON (payment.staff_id = staff.staff_id)
GROUP BY staff.first_name;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
DESCRIBE film;

SELECT film.title, COUNT(film_actor.actor_id)
FROM 
	film
    INNER JOIN
    film_actor
    ON (film.film_id = film_actor.film_id)
GROUP BY film.title;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT film.title, COUNT(inventory.film_id) as number_of_copies
FROM 
	film
    LEFT JOIN
    inventory
    ON(film.film_id = inventory.film_id)
WHERE title IN(
	SELECT title
    FROM film
    WHERE title = 'Hunchback Impossible');
    
-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
SELECT * FROM payment;

SELECT c.first_name, c.last_name, SUM(p.amount) as total_paid
FROM 
	customer c
    LEFT JOIN
    payment p
    ON(c.customer_id = p.customer_id)
GROUP BY c.last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. 
-- Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT * FROM language;

SELECT title
FROM film 
WHERE title IN(
	SELECT title
    FROM 
    film
    INNER JOIN
    language
    ON(language.language_id = film.language_id)
    WHERE 
    language.name = 'English'AND 
    film.title LIKE 'K%' OR film.title LIKE 'Q%');
    
-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.

SELECT Actor_Name
FROM actor
WHERE actor_id IN(
	SELECT actor_id
    FROM film_actor
    WHERE film_id IN(
		SELECT film_id
        FROM film
        WHERE title = 'Alone Trip'));

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
-- Code to flip between tables and identify join parameters
SELECT * FROM customer; -- includes address_id
SELECT * FROM address; -- includes address_id, city_id 
SELECT * FROM city; -- includes city_id, country_id
SELECT * FROM country; -- includes country, country_id

SELECT c.first_name, c.last_name, c.email 
FROM 
	customer c
    INNER JOIN
    address
    ON(c.address_id = address.address_id)
    INNER JOIN
    city
    ON(address.city_id = city.city_id)
    INNER JOIN
    country
    ON (city.country_id = country.country_id)
WHERE country = 'Canada';

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as famiy films.
SELECT * FROM category; -- includes category_id and name (should be category_name)
SELECT * from film_category; -- includes film_id and category_id

SELECT title 
FROM film
WHERE film_id IN(
	SELECT film_id
    FROM film_category
    WHERE category_id IN(
		SELECT category_id
        FROM category
		WHERE category.name = 'family'));

-- 7e. Display the most frequently rented movies in descending order.
SELECT * from rental; -- includes inventory_id, rental_id
SELECT * from film; -- includes title, film_id
SELECT * FROM inventory; -- includes inventory_id, film_id

SELECT title, COUNT(rental.inventory_id) as total_rentals
FROM 
	film
    LEFT JOIN
    inventory
    ON(film.film_id = inventory.film_id)
    LEFT JOIN
    rental
    ON (inventory.inventory_id = rental.inventory_id)
GROUP BY film.title
ORDER BY total_rentals DESC;
    
-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT * FROM staff; -- staff_id, store_id
SELECT * FROM rental; -- includes rental_id, staff_id
SELECT * FROM payment; -- includes payment_id, rental_id, amount

SELECT store.store_id, SUM(payment.amount)
FROM 
	payment
    LEFT JOIN
    rental
    ON (payment.rental_id = rental.rental_id)
    LEFT JOIN
    staff
    ON(rental.staff_id = staff.staff_id)
    LEFT JOIN
    store
    ON (store.store_id = staff.store_id)
GROUP BY store.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT * FROM store; -- has store_id, address_id
SELECT * FROM address; -- has address_id, city_id
SELECT * FROM city; -- has country_id

SELECT store.store_id, city.city, country.country 
FROM 
	store
    INNER JOIN
    address
    ON(store.address_id = address.address_id)
    INNER JOIN
    city
    ON(city.city_id = address.city_id)
    INNER JOIN
    country
    ON(country.country_id = city.country_id);
    
 
-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT * FROM category; -- category_id, name
SELECT * FROM film_category; -- film_id, category_id
SELECT * FROM rental; -- rental_id, inventory_id
SELECT * FROM payment; -- rental_id, amount
SELECT * FROM inventory; -- film_id, inventory_id

SELECT category.name, SUM(payment.amount) AS genre_revenue
FROM 
	category
    INNER JOIN
    film_category
    ON(category.category_id = film_category.category_id)
    INNER JOIN
    inventory
    ON(inventory.film_id = film_category.film_id)
    LEFT JOIN
    rental
    ON(inventory.inventory_id = rental.inventory_id)
    LEFT JOIN
    payment
    ON(rental.rental_id = payment.rental_id)
GROUP BY category.name
ORDER BY genre_revenue DESC LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. 
-- If you haven't solved 7h, you can substitute another query to create a view.

-- 8b. How would you display the view that you created in 8a?

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.