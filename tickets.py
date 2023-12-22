import tkinter as tk
import pandas
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


# Ventana principal
ws = tk.Tk()
ws.title("Tickets Vitalhealth")
ws.geometry('1280x640+100+30')
current_id = read_last_id_from_file()
df = pandas.read_csv('output.csv',
                     index_col='id',
                     header=0,
                     names=['id', 'Departamento', 'Numero de serie', 'Fecha de Generacion', 'Problema', 'Status'])
print(df)

tk.Label(ws, text="Sistema de tickets...", font=('Arial', 15)).pack(fill=tk.BOTH, expand=False)

# Crear frame para mover hacia la izquierda
left_frame = tk.Frame(ws)
left_frame.pack(side=tk.LEFT, padx=90, pady=60)

def set_current_date():
    current_date = datetime.now().strftime("%Y-%m-%d")
    date_text.delete(1.0, tk.END)
    date_text.insert(tk.END, current_date)


# ID
tk.Label(left_frame, text="Id", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
Id = tk.Text(left_frame, height=1, width=25, bg="white")
Id.insert(tk.END, str(current_id).zfill(3))
Id.config(state='disabled')
Id.pack()

# dropdown menu de departamentos
tk.Label(left_frame, text="\nDepartamentos", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
dp_variable = tk.StringVar(left_frame)
dp_variable.set("---")
dropdown = tk.OptionMenu(left_frame, dp_variable, "Contaduria", "Eventos", "Marketing", "Customer Service")
dropdown.pack()

# TextBox editable de Numero de laptop
tk.Label(left_frame, text="Numero de serie", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
serial = tk.Text(left_frame, height=1, width=25, bg="white")
serial.pack()

# TextBox automatico no editable de fecha actual
tk.Label(left_frame, text="Fecha", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
date_text = tk.Text(left_frame, height=1, width=25, bg="white")
date_text.config(state='normal')
set_current_date()
date_text.config(state='disabled')
date_text.pack()

# Textbox Editable de problema
tk.Label(left_frame, text="Problema", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
problem = tk.Text(left_frame, height=7, width=25, bg="white")
problem.pack()

# Status no editable
tk.Label(left_frame, text="Status", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)
status = tk.Text(left_frame, height=1, width=25, bg="white")
status.insert(tk.END, "Incomplete")
status.config(state='disabled')
status.pack()

# boton de agregar
def Agregar_Datos():
    global current_id
    input_data = str(current_id).zfill(3), dp_variable.get(), serial.get("1.0", "end-1c"), date_text.get("1.0", "end-1c"), problem.get("1.0", "end-1c"), status.get("1.0", "end-1c")
    print(input_data)

    # Incrementar ID
    current_id += 1

    # Definir header
    header_row = "id, Departamento, Numero de Serie, Fecha de Generacion, Problema, Status"

    # Escribir el header si el archivo esta vacio
    try:
        with open('output.csv', 'r') as file:
            content = file.read()
            if not content.strip():
                file.write(header_row + '\n')
    except FileNotFoundError:
        # Si no existe el archivo, crear con header
        with open('output.csv', 'w') as file:
            file.write(header_row + '\n')

    # Agregar datos al archivo
    with open('output.csv', 'a') as file:
        file.write(', '.join(map(str, input_data)) + '\n')

    # Actualizar Id
    Id.config(state='normal')
    Id.delete(1.0, tk.END)
    Id.insert(tk.END, str(current_id).zfill(3))
    Id.config(state='disabled')

    # Actualizar Actividades
    Act.config(state='normal')
    df = pandas.read_csv('output.csv', index_col='id',
                     header=0, names=['id', 'Departamento', 'Numero de serie', 'Fecha de Generacion', 'Problema', 'Status'])
    Act.delete(1.0, tk.END)
    Act.insert(tk.END, df.to_string(index=True, col_space=1, justify='right'))

    Act.config(state='disabled')

    # Limpiar campos
    dp_variable.set("---")
    serial.delete(1.0, tk.END)
    set_current_date()
    problem.delete(1.0, tk.END)
    status.delete(1.0, tk.END)

Display = tk.Button(left_frame, height=2,
                    width=20,
                    text="Agregar",
                    command=lambda: [Agregar_Datos()])
Display.pack()

# Area de finalizacion
tk.Label(left_frame, text="\nArea de finalizacion", font=('Arial', 10)).pack(fill=tk.BOTH, expand=False)

# Tabla de actividades
Act = tk.Text(ws, height=70, width=100, bg="white")
Act.insert(tk.END, df.to_string(index=True))  
Act.config(state='disabled')
Act.pack(side=tk.RIGHT, padx=10, pady=10)


ws.columnconfigure(2, weight=2)  
ws.rowconfigure(1, weight=1)

#Inicializar el archivo con el ultimo ID
current_id = read_last_id_from_file()

# Empezar el ciclo de tkinter
ws.mainloop()
