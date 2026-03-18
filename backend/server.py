import json
import os
import uuid
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = "/home/clarence/pizza-ranch-manager/data"


def data_path(name: str) -> str:
    return os.path.join(DATA_DIR, f"{name}.json")


def load(name: str) -> list:
    p = data_path(name)
    if not os.path.exists(p):
        return []
    with open(p) as f:
        return json.load(f)


def save(name: str, data: list):
    with open(data_path(name), "w") as f:
        json.dump(data, f, indent=2)


# --- Auth ---

class LoginRequest(BaseModel):
    password: str

@app.post("/login")
async def login(req: LoginRequest):
    if req.password == "ranch2026":
        return {"success": True, "role": "manager"}
    if req.password == "staff2026":
        return {"success": True, "role": "staff"}
    return {"success": False, "error": "Invalid password"}


# --- Specials ---

class SpecialRequest(BaseModel):
    name: str
    description: str

@app.get("/specials")
async def get_specials():
    items = load("specials")
    return items

@app.post("/specials")
async def add_special(req: SpecialRequest):
    items = load("specials")
    items.append({
        "id": str(uuid.uuid4())[:8],
        "name": req.name,
        "description": req.description,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    save("specials", items)
    return {"status": "ok"}


# --- Inventory ---

class InventoryRequest(BaseModel):
    items: list[dict]

@app.get("/inventory")
async def get_inventory():
    return load("inventory")

@app.post("/inventory")
async def save_inventory(req: InventoryRequest):
    save("inventory", req.items)
    return {"status": "ok"}


class InventoryAddRequest(BaseModel):
    name: str

@app.post("/inventory/add")
async def add_inventory_item(req: InventoryAddRequest):
    items = load("inventory")
    items.append({"name": req.name, "checked": False, "notes": ""})
    save("inventory", items)
    return {"status": "ok"}

@app.delete("/inventory/{item_name}")
async def delete_inventory_item(item_name: str):
    items = [i for i in load("inventory") if i.get("name") != item_name]
    save("inventory", items)
    return {"status": "ok"}


# --- Complaints ---

class ComplaintRequest(BaseModel):
    customer_name: str = ""
    text: str
    severity: str = "medium"

@app.get("/complaints")
async def get_complaints():
    return load("complaints")

@app.post("/complaints")
async def add_complaint(req: ComplaintRequest):
    items = load("complaints")
    items.append({
        "id": str(uuid.uuid4())[:8],
        "customer_name": req.customer_name,
        "text": req.text,
        "severity": req.severity,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    save("complaints", items)
    return {"status": "ok"}

@app.delete("/complaints/{item_id}")
async def delete_complaint(item_id: str):
    items = [i for i in load("complaints") if i.get("id") != item_id]
    save("complaints", items)
    return {"status": "ok"}


# --- Parties ---

class PartyRequest(BaseModel):
    contact_name: str
    phone: str
    date: str
    time: str
    guest_count: int
    deposit_paid: bool = False
    special_requests: str = ""

@app.get("/parties")
async def get_parties():
    return load("parties")

@app.post("/parties")
async def add_party(req: PartyRequest):
    items = load("parties")
    items.append({
        "id": str(uuid.uuid4())[:8],
        "contact_name": req.contact_name,
        "phone": req.phone,
        "date": req.date,
        "time": req.time,
        "guest_count": req.guest_count,
        "deposit_paid": req.deposit_paid,
        "special_requests": req.special_requests,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    save("parties", items)
    return {"status": "ok"}

@app.delete("/parties/{item_id}")
async def delete_party(item_id: str):
    items = [i for i in load("parties") if i.get("id") != item_id]
    save("parties", items)
    return {"status": "ok"}


# --- Announcements ---

class AnnouncementRequest(BaseModel):
    title: str
    message: str
    priority: str = "normal"

@app.get("/announcements")
async def get_announcements():
    return load("announcements")

@app.post("/announcements")
async def add_announcement(req: AnnouncementRequest):
    items = load("announcements")
    items.append({
        "id": str(uuid.uuid4())[:8],
        "title": req.title,
        "message": req.message,
        "priority": req.priority,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    save("announcements", items)
    return {"status": "ok"}


# --- Shifts ---

class ShiftRequest(BaseModel):
    date: str
    time: str
    position: str
    notes: str = ""

class ClaimShiftRequest(BaseModel):
    claimed_by: str

@app.get("/shifts")
async def get_shifts():
    return load("shifts")

@app.post("/shifts")
async def add_shift(req: ShiftRequest):
    items = load("shifts")
    items.append({
        "id": str(uuid.uuid4())[:8],
        "date": req.date,
        "time": req.time,
        "position": req.position,
        "notes": req.notes,
        "claimed_by": "",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    save("shifts", items)
    return {"status": "ok"}

@app.put("/shifts/{item_id}/claim")
async def claim_shift(item_id: str, req: ClaimShiftRequest):
    items = load("shifts")
    for item in items:
        if item.get("id") == item_id:
            item["claimed_by"] = req.claimed_by
            break
    save("shifts", items)
    return {"status": "ok"}

@app.delete("/shifts/{item_id}")
async def delete_shift(item_id: str):
    items = [i for i in load("shifts") if i.get("id") != item_id]
    save("shifts", items)
    return {"status": "ok"}


# --- Sales ---

class SalesRequest(BaseModel):
    covers_served: int
    buffet_revenue: float
    arcade_revenue: float
    notes: str = ""

@app.get("/sales")
async def get_sales():
    return load("sales")

@app.post("/sales")
async def add_sales(req: SalesRequest):
    items = load("sales")
    new_id = str(uuid.uuid4())
    print(f"[Sales POST] Creating entry with id={new_id}")
    items.append({
        "id": new_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "covers_served": req.covers_served,
        "buffet_revenue": req.buffet_revenue,
        "arcade_revenue": req.arcade_revenue,
        "notes": req.notes,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })
    save("sales", items)
    return {"status": "ok"}

@app.delete("/sales/{item_id}")
async def delete_sales(item_id: str):
    print(f"[Sales DELETE] Deleting id={item_id}")
    items = [i for i in load("sales") if i.get("id") != item_id]
    save("sales", items)
    return {"status": "ok"}

@app.put("/sales/{item_id}")
async def update_sales(item_id: str, req: SalesRequest):
    items = load("sales")
    existing_ids = [i.get("id") for i in items]
    print(f"[Sales PUT] Looking for id={item_id} in {existing_ids}")
    found = False
    for item in items:
        if item.get("id") == item_id:
            item["covers_served"] = req.covers_served
            item["buffet_revenue"] = req.buffet_revenue
            item["arcade_revenue"] = req.arcade_revenue
            item["notes"] = req.notes
            found = True
            print(f"[Sales PUT] Updated entry id={item_id}")
            break
    if not found:
        print(f"[Sales PUT] WARNING: id={item_id} not found!")
    save("sales", items)
    return {"status": "ok", "found": found}
