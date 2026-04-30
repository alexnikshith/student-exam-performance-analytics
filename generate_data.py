import pandas as pd
import numpy as np
import random
import os

def generate_sample_data(num_students=60, filename='data/student_marks.csv'):
    # Ensure data directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    np.random.seed(42)
    random.seed(42)
    
    first_names = ["John", "Alice", "Bob", "Emma", "David", "Sophia", "Michael", "Olivia", "James", "Isabella", 
                   "William", "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia", "Henry", "Harper", "Alexander", "Evelyn",
                   "Daniel", "Abigail", "Matthew", "Emily", "Joseph", "Elizabeth", "Samuel", "Mila", "David", "Ella",
                   "Carter", "Avery", "Wyatt", "Sofia", "Jayden", "Camila", "Gabriel", "Aria", "Isaac", "Scarlett",
                   "Lincoln", "Victoria", "Anthony", "Madison", "Hudson", "Luna", "Dylan", "Grace", "Ezra", "Chloe",
                   "Thomas", "Penelope", "Charles", "Layla", "Christopher", "Riley", "Jaxon", "Zoey", "Maverick", "Nora"]
    
    classes = [10]
    sections = ['A', 'B', 'C']
    
    data = []
    
    for i in range(num_students):
        student_id = 1000 + i
        name = first_names[i % len(first_names)] + f"_{i}" if i >= len(first_names) else first_names[i]
        cls = random.choice(classes)
        sec = random.choice(sections)
        
        # Internal (Max 30), External (Max 70)
        math_int = np.random.randint(10, 31)
        math_ext = np.random.randint(25, 71)
        
        sci_int = np.random.randint(12, 31)
        sci_ext = np.random.randint(20, 71)
        
        eng_int = np.random.randint(15, 31)
        eng_ext = np.random.randint(30, 71)
        
        comp_int = np.random.randint(18, 31)
        comp_ext = np.random.randint(35, 71)
        
        total_classes = 100
        classes_attended = np.random.randint(60, 101) # Attendance between 60% and 100%
        
        data.append([
            student_id, name, cls, sec,
            math_int, math_ext,
            sci_int, sci_ext,
            eng_int, eng_ext,
            comp_int, comp_ext,
            total_classes, classes_attended
        ])
        
    columns = [
        'Student_ID', 'Student_Name', 'Class', 'Section',
        'Math_Internal', 'Math_External',
        'Science_Internal', 'Science_External',
        'English_Internal', 'English_External',
        'Computer_Internal', 'Computer_External',
        'Total_Classes', 'Classes_Attended'
    ]
    
    df = pd.DataFrame(data, columns=columns)
    
    # Introduce a few missing values to demonstrate data cleaning
    df.loc[5, 'Math_External'] = np.nan
    df.loc[12, 'Science_Internal'] = np.nan
    df.loc[25, 'English_External'] = np.nan
    
    df.to_csv(filename, index=False)
    print(f"Dataset generated successfully at {filename} with {num_students} records.")

if __name__ == "__main__":
    generate_sample_data()
