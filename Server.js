// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// Create Express application
const app = express();
const port = 3000;
app.use(cors());
// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhan@123',
    database: 'sugam' // This should be the name of your database
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes

// Get all users
// Fetch all states
app.get('/states', (req, res) => {
    connection.query('SELECT * FROM sugam.states;', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        res.json(results);
    });
});

// Fetch districts by state id
app.get('/districts/:state_id', (req, res) => {
    const stateId = req.params.state_id;
    connection.query('SELECT * FROM sugam.districts WHERE State_id = ?', [stateId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        res.json(results);
    });
});




app.get('/federations/:state_id/:district_id', (req, res) => {
    const stateId = req.params.state_id;
    const districtId = req.params.district_id;
    
    // Update your SQL query to use the correct table name: `fedration`
    connection.query('SELECT * FROM sugam.fedration WHERE State_id = ? AND District_id = ?', [stateId, districtId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        res.json(results);
    });
});


app.get('/panchayats/:state_id/:district_id/:fedration_id', (req, res) => {
    const stateId = req.params.state_id;
    const districtId = req.params.district_id;
    const fedrationId = req.params.fedration_id;
    
    connection.query('SELECT * FROM sugam.panchayat WHERE State_id = ? AND District_id = ? AND Fedration_id = ?', 
        [stateId, districtId, fedrationId], (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error executing query');
            }
            res.json(results);
        });
});


app.get('/adolescentgroups', (req, res) => {
    connection.query('SELECT * FROM sugam.adolescentgroup;', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        res.json(results);
    });
});


app.get('/villages/:state_id/:district_id/:fedration_id/:panchayat_id', (req, res) => {
    const stateId = req.params.state_id;
    const districtId = req.params.district_id;
    const fedrationId = req.params.fedration_id;
    const panchayatId = req.params.panchayat_id;
    
    connection.query('SELECT * FROM sugam.village WHERE State_id = ? AND District_id = ? AND Fedration_id = ? AND Panchayat_id = ?', 
        [stateId, districtId, fedrationId, panchayatId], (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error executing query');
            }
            res.json(results);
        });
});





app.post('/api/submitAdolescentgirl', (req, res) => {
    console.log('Received request body:', req.body);
    const formData = req.body;
    
    // Extract relevant data from the request body
    const { State_id, District_id, Fedration_id, Panchayat_id, Village_id, AdolescentGroup_id,
            GroupName, Contact, FullName, BirthDate, MarriageYear, MothersName, MothersMembership,
            FathersName, FathersMembership, CurrentlyStudying, HighestClass, CurrentWork, Hemoglobin,
            Height, Weight, PubertyYear, bmi, bmi_report,age } = formData;
    
    // Construct the SQL query to insert data into the Adolescentgirl table
    const sql = `INSERT INTO sugam.Adolescentgirl 
    (State_id, District_id, Fedration_id, Panchayat_id, Village_id, AdolescentGroup_id,
    GroupName, Contact, FullName, BirthDate, MarriageYear, MothersName, MothersMembership,
    FathersName, FathersMembership, CurrentlyStudying, HighestClass, CurrentWork, Hemoglobin,
    Height, Weight, PubertyYear, bmi, bmi_report,age)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the SQL query with the provided data
    connection.query(sql, [State_id, District_id, Fedration_id, Panchayat_id, Village_id, AdolescentGroup_id,
                           GroupName, Contact, FullName, BirthDate, MarriageYear, MothersName, MothersMembership,
                           FathersName, FathersMembership, CurrentlyStudying, HighestClass, CurrentWork, Hemoglobin,
                           Height, Weight, PubertyYear, bmi, bmi_report, age], (err, result) => {
        if (err) {
            console.error('Error inserting Adolescentgirl data:', err);
            res.status(500).send('Failed to submit Adolescentgirl data');
            return;
        }
        console.log('Adolescentgirl data inserted successfully:', result);
        res.send('Adolescentgirl data submitted successfully');
    });
});























// Get a single user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(results[0]);
    });
});



app.post('/api/submitForm', (req, res) => {
    console.log('Received request body:', req.body);
    const formData = req.body;
    
    const { EmpID, EmpName, EmpAge, EmpDept } = formData;
    
    const sql = `INSERT INTO dhan.employee 
              SET
              EmpID = '${EmpID}',
              EmpName = '${EmpName}', 
              EmpAge = ${EmpAge},
              EmpDept = '${EmpDept}'`;
  
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error inserting form data:', err);
        res.status(500).send('Failed to submit form');
        return;
      }
      console.log('Form data inserted successfully:', result);
      res.send('Form submitted successfully');
    });
});





// app.post('/submitForm', (req, res) => {
//     console.log('Received request body:', req.body);
//     const { EmpName } = req.body;
  
//     const sql = 'INSERT INTO dhan.emp (ID, EmpName) VALUES (NULL, ?)';
//     connection.query(sql, [EmpName], (err, result) => {
//       if (err) {
//         console.error('Error inserting form data:', err);
//         res.status(500).json({ success: false, message: 'Failed to submit form' }); // Send error response
//         return;
//       }
//       console.log('Form data inserted successfully:', result);
//       res.json({ success: true, message: 'Form submitted successfully' }); // Send success response
//     });
// });

















// Define route to handle form submissions
app.post('/api/updateForm', (req, res) => {
    const { EmpID, EmpName, EmpAge, EmpDept } = req.body;
    const sql = `UPDATE dhan.employee 
                 SET EmpName = '${EmpName}', 
                     EmpAge = ${EmpAge},
                     EmpDept = '${EmpDept}'
                 WHERE EmpID = '${EmpID}'`;
    
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error updating form data:', err);
        return res.status(500).send('Failed to update form');
      }
      console.log('Form data updated successfully:', result);
      res.send('Form updated successfully');
    });
  });
  


// Define route to handle form submissions
app.post('/api/submitForm1', (req, res) => {
    console.log('Received request body:', req.body);
    const formData = req.body;
    
    const { EmpName, EmpNameDep } = formData;
    
    const sql = `INSERT INTO emp 
                 SET 
                     EmpName = '${EmpName}', 
                     EmpNameDep = '${EmpNameDep}'`;
  
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error inserting form data:', err);
            return res.status(500).send('Failed to submit form');
        }
        console.log('Form data inserted successfully:', result);
        res.send('Form submitted successfully');
    });
});




// Update an existing user
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    connection.query('UPDATE users SET ? WHERE id = ?', [updatedUser, userId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        res.status(200).send('User updated successfully');
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    connection.query('DELETE FROM users WHERE id = ?', [userId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Error executing query');
        }
        res.status(200).send('User deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
