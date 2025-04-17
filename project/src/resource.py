import numpy as np
import threading
import time
from scipy.optimize import linprog
import random

# Define disaster types and severity levels
disaster_types = ["Earthquake", "Flood", "Hurricane", "Fire", "Landslide","Not a disaster"]
severity_levels = ["Little to None", "Mild", "Severe"]

# Resource types and their max availability (global resources)
resources = {
    "Ambulances": 200,
    "Fire Trucks": 80,
    "Rescue Helicopters": 30,
    "Earth Movers": 120,
    "Search and Rescue Teams": 350,
    "First Aid Teams": 250,
    "Rescue Boats": 60
}

# Lock for thread-safe resource modification
resource_lock = threading.Lock()

# Priority allocation matrix
allocation_matrix = np.array([
    [60,   30,  50, 80, 80,  80,  0],   # Earthquake
    [10,   30, 80,   0, 80, 50, 80],   # Flood
    [50,   30, 50,  40, 80, 80, 50],   # Hurricane
    [70,   80, 20,   0, 50, 80,  0],   # Fire
    [50,   30, 30,  80, 70, 70,  0],
    [0,   0, 0,  0, 0, 0,  0]   
])

# Severity scaling factor
severity_scale = {
    "Little to None": 0.009,
    "Mild": 0.025,
    "Severe": 0.05
}

# ✅ Thread-safe resource restoration
def restore_resources(allocated_resources, delay=True):
    global resources
    if delay:
        time.sleep(40)
    else:
        time.sleep(20)
    
    with resource_lock:
        for resource, amount in allocated_resources.items():
            resources[resource] += amount

    print("\n✅ Resources restored!\n")
    print("📦 Updated Global Resources:")
    with resource_lock:
        for res, val in resources.items():
            print(f"   {res}: {val}")

# 🚨 Allocation function
def allocate_resources(disaster_type, severity_level, return_only=False):
    if disaster_type not in disaster_types or severity_level not in severity_scale:
        return None

    global resources
    severity_factor = severity_scale[severity_level]
    scaled_priority = allocation_matrix[disaster_types.index(disaster_type)]
    c = -scaled_priority
    with resource_lock:
        bounds = [(0, severity_factor * resources[res]) for res in resources.keys()]

    result = linprog(c, bounds=bounds, method="highs-ds")

    if result.success:
        allocated_resources = result.x
        allocated_dict = {}
        with resource_lock:
            for i, resource in enumerate(resources.keys()):
                allocated = int(round(allocated_resources[i]))
                allocated_dict[resource] = allocated
                if not return_only:
                    resources[resource] -= allocated

        if return_only:
            return allocated_dict

        ran = random.random()
        print(ran)
        if ran < 0.95:
            print("\n🚨 Resources have arrived!\n")
            restore_thread = threading.Thread(target=restore_resources, args=(allocated_dict,))
            restore_thread.start()
        else:
            print("\n⚠️ Resources failed to arrive. Auto-restoring...\n")
            restore_resources(allocated_dict, delay=False)

        return allocated_dict
    else:
        return None
