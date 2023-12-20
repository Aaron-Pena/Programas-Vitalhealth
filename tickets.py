import tkinter as tk
from tkinter import *
from datetime import datetime


def read_last_id_from_file():
    try:
        with open('output.csv', 'r') as file:
            lines = file.readlines()
            if len(lines) > 1:  
                last_entry = lines[-1].split(', ')
                last_id = int(last_entry[0])
                return last_id + 1  
            else:
                return 1 
    except FileNotFoundError:
        return 1  

def write_last_id_to_file(last_id):
    with open('output.csv', 'a') as file:
        file.write(f'{last_id}\n')

# Create the main window
ws = tk.Tk()
ws.title("Tickets Vitalhealth")
ws.geometry('720x640+400+50')
current_id = read_last_id_from_file()

tk.Label(ws,text="Sistema de tickets...",font=('Arial',15)).pack(fill=tk.BOTH, expand=False)

def set_current_date():
    current_date = datetime.now().strftime("%Y-%m-%d")  
    date_text.delete(1.0, tk.END)  
    date_text.insert(tk.END, current_date)  
    

# ID
tk.Label(ws, text="Id", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
Id = tk.Text(ws, height=1, width=25, bg="white")
Id.insert(tk.END, str(current_id).zfill(3))
Id.config(state='disabled')
Id.pack()

#dropdown menu de departamentos
tk.Label(ws,text="\nDepartamentos",font=('Arial',10)).pack(fill=tk.BOTH, expand=False)
dp_variable = tk.StringVar(ws)
dp_variable.set("---") 
dropdown = tk.OptionMenu(ws, dp_variable, "Contaduria", "Eventos", "Marketing","Customer Service")
dropdown.pack()

#TextBox editable de Numero de laptop
tk.Label(ws,text="Numero de serie",font=('Arial',10)).pack(fill=tk.BOTH, expand=False)
serial = tk.Text(ws, height = 1,
                width = 25,
                bg = "white")
serial.pack()
 
#TextBox automatico no editable de fecha actual
tk.Label(ws, text="Fecha", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
date_text = tk.Text(ws, height=1, width=25, bg="white")
date_text.config(state='normal')
set_current_date()
date_text.config(state='disabled')
date_text.pack()

#Textbox Editable de problema
tk.Label(ws,text="Problema",font=('Arial',10)).pack(fill=tk.BOTH, expand=False)
problem = tk.Text(ws, height = 7,
                width = 25,
                bg = "white")
problem.pack()
 
#Status no editable
tk.Label(ws,text="Status",font=('Arial',10)).pack(fill=tk.BOTH, expand=False)
status = tk.Text(ws, height = 1,
                width = 25,
                bg = "white")
status.insert(tk.END, "Incomplete")
status.config(state='disabled')
status.pack()

#boton de agregar
def Agregar_Datos():
    global current_id 
    input_data = str(current_id).zfill(3),dp_variable.get(),serial.get("1.0", "end-1c"), date_text.get("1.0", "end-1c"),problem.get("1.0", "end-1c"),status.get("1.0", "end-1c")
    print(input_data)
    
    # Increment the ID for the next entry
    current_id += 1
    
    # Define the header row
    header_row = "id, Departamento, Numero de Serie, Fecha de Generacion, Problema, Status"

    # Write the header row if the file is empty
    try:
        with open('output.csv', 'r') as file:
            content = file.read()
            if not content.strip():
                file.write(header_row + '\n')
    except FileNotFoundError:
        # If the file doesn't exist, create it with the header row
        with open('output.csv', 'w') as file:
            file.write(header_row + '\n')

    # Append the data to the file
    with open('output.csv', 'a') as file:
        file.write(', '.join(map(str, input_data)) + '\n')
        
    # Update the ID for display
    Id.config(state='normal')  # Allow modification
    Id.delete(1.0, tk.END)
    Id.insert(tk.END, str(current_id).zfill(3))
    Id.config(state='disabled')  # Disable modification 

    # Clear the input fields
    dp_variable.set("---")
    serial.delete(1.0, tk.END)
    set_current_date()
    problem.delete(1.0, tk.END)
    status.delete(1.0, tk.END)

Display = tk.Button(ws, height = 2,
                 width = 20, 
                 text ="Agregar",
                 command = lambda:[Agregar_Datos()])

Display.pack()

#boton de finalizar
tk.Label(ws,text="\nArea de finalizacion",font=('Arial',10)).pack(fill=tk.BOTH, expand=False)

# Initialize the current ID from the last used ID in the CSV file
current_id = read_last_id_from_file()

# Start the Tkinter event loop

ws.mainloop()
