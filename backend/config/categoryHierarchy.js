const categoryHierarchy = {

    "Personal Protective Equipment (PPE) and Safety Gear": {
        "Face Masks and Respirators": ["Surgical Masks", "N95 Respirators", "Dust Masks", "Face Shields", "Reusable Face Masks", "Anti - Fog Masks", "Respirator Cartridges and Filters"],
        "Gloves and Hand Protection": ["Disposable Gloves", "Cut - Resistant Gloves", "Heat - Resistant Gloves", "Rubber Gloves", "Leather Work Gloves", "Medical Examination Gloves", "Finger Guards"],
        "Eye Protection": ["Safety Glasses", "Welding Goggles", "Impact - Resistant Goggles", "Face Shields", "Prescription Safety Glasses", "Laser Protection Glasses", "Anti - Scratch and Anti - Fog Lenses"],
        "Hearing Protection": ["Foam Earplugs, Silicone Earplugs", "Noise - Cancelling Headphones", "Earmuff Hearing Protectors", "Digital Hearing Protection", "Disposable Earplugs", "Custom - Molded Earplugs"],
        "High-Visibility Clothing": ["Reflective Vests", "Hi - Vis Jackets and Coats", "Hi - Vis Pants and Bibs", "Reflective Gloves", "Traffic Safety Clothing", "Neon Safety Hats", "Work Wear with Reflective Tape"],
        "Protective Clothing": ["Disposable Coveralls", "Chemical - Resistant Coveralls", "Flame - Resistant Coveralls", "Chemical - Resistant Aprons", "Welding Protective Clothing", "High - Visibility Coveralls", "Lab Coats and Gowns", "Protective Sleeves and Bibs"],
        "Work Boots and Footwear": ["Steel-Toe Boots", "Waterproof Work Boots", "Slip - Resistant Boots", "Insulated Boots", "Hiking Boots for Work", "Safety Shoes", "Composite Toe Footwear"],
    },

    "Industrial Tools and Machinery": {

        "Power Tools": ["Cordless Drills, Impact Drivers", "Angle Grinders", "Circular Saws", "Reciprocating Saws", "Jigsaws", "Sanders", "Heat Guns", "Power Tool Combo Kits"],
        "Hand Tools": ["Adjustable Wrenches", "Hammers", "Screwdrivers", "Pliers", "Measuring Tapes", "Utility Knives", "Sockets and Socket Sets"],
        "Cutting Tools": ["Cutting Torches", "Band Saws", "CNC Milling Machines", "Hole Saw Kits", "Hacksaws", "Scissors and Shears", "Metal Cutters "],
        "Lifting and Rigging Equipment": ["Hoists", "Chain Slings and Shackles", "Lifting Straps", "Winches", "Overhead Cranes", "Forklifts and Pallet Jacks", "Pulley Systems "],
        "Welding and Soldering Tools": ["MIG Welders, TIG Welders", "Welding Torches and Accessories", "Soldering Irons", "Welding Helmets and Masks", "Plasma Cutters", "Welding Rods and Electrodes "],
        "Fastening Tools": ["Pneumatic Nail Guns, Staple Guns", "Rivet Guns", "Screw Guns", "Torque Wrenches", "Pneumatic Fasteners", "Power Staplers "],
        "Heavy Machinery": ["Mini Excavators", "Bulldozers", "Skid Steer Loaders", "Backhoe Loaders", "Track Loaders", "Cranes", "Excavator Attachments "],

    },

    "Electrical Instruments and Appliances ": {
        "Circuit Breakers and Fuses": ["Miniature Circuit Breakers, Molded Case Circuit Breakers", "Fuse Holders and Bases", "Cartridge Fuses", "Thermal Circuit Breakers", "Resettable Fuses", "Surge Protection Devices "],
        "Cable and Wiring": ["Electrical Cables, Extension Cords", "Coaxial Cables", "Ethernet Cables", "Power Cords and Plugs", "PVC Insulated Wires", "Armored Cables "],
        "Electrical Testers and Meters": ["Multimeters, Clamp Meters", "Circuit Testers", "Voltage Detectors", "Insulation Resistance Testers", "Power Analyzers", "Earth Ground Resistance Meters "],
        "Switches and Sockets": ["Light Switches, Dimmer Switches", "Electrical Outlets", "GFCI Outlets", "Smart Switches", "Push Button Switches", "USB Wall Outlets", "Electrical Outlet Boxes "],
        "Lighting Fixtures and Bulbs": ["LED Bulbs, Incandescent Bulbs", "Fluorescent Lights", "Pendant Lighting", "Recessed Lighting", "Emergency and Exit Lighting", "Floodlights and Spotlights", "Lamp Fixtures and Bases "],
        "Power Strips and Extension Cords": ["Surge Protector Power Strips, Heavy - Duty Extension Cords", "Wall - Mountable Power Strips", "Multi - Outlets", "Cordless Power Strips", "Power Cords for Appliances", "Extension Cord Reels "],
        "Electric Motors and Transformers": ["Induction Motors, Synchronous Motors", "Step - Up / Step - Down Transformers", "Brushless Motors", "Electric Actuators", "DC Motors", "Servo Motors", "Motor Controllers "],

    },

    "Electronic Components": {
        "Passive Components": [
            "Resistors (Fixed, Variable, Network)",
            "Capacitors (Ceramic, Electrolytic, Tantalum, Film)",
            "Inductors and Coils",
            "Transformers",
            "Crystals and Oscillators"
        ],
        "Active Components": [
            "Transistors (BJT, MOSFET, IGBT)",
            "Diodes (Zener, Schottky, Rectifier, LEDs)",
            "Thyristors and Triacs",
            "Integrated Circuits (ICs)",
            "Microcontrollers (e.g., ATmega, PIC, STM32)",
            "Operational Amplifiers",
            "Logic ICs",
            "Timer ICs (e.g., 555)",
            "Memory ICs (EEPROM, Flash)"
        ],
        "Power Components": [
            "Voltage Regulators (Linear, Switching)",
            "Power Modules",
            "Relays",
            "Batteries and Battery Holders",
            "Power Supplies and Converters (AC-DC, DC-DC)"
        ],
        "Electromechanical Components": [
            "Switches (Tactile, Toggle, DIP, Push button)",
            "Connectors (Header, Terminal Block, USB, HDMI)",
            "Sockets and Adapters",
            "Motors (Stepper, Servo, DC)",
            "Buzzers and Speakers"
        ],
        "Sensors and Modules": [
            "Temperature and Humidity Sensors",
            "Motion Sensors (PIR, Ultrasonic)",
            "Gas and Smoke Sensors",
            "Light Sensors (LDR, Photodiode)",
            "Proximity and Touch Sensors",
            "Sensor Modules (e.g., HC-SR04, IR modules)"
        ],
        "Communication Modules": [
            "Bluetooth (HC-05, HM-10)",
            "Wi-Fi (ESP8266, ESP32)",
            "RF Modules (433MHz, NRF24L01)",
            "LoRa Modules",
            "GSM/GPRS Modules",
            "GPS Modules"
        ],
        "Development Boards and Kits": [
            "Arduino Boards (Uno, Nano, Mega)",
            "Raspberry Pi",
            "ESP Boards (ESP32, ESP8266)",
            "Sensor Kits",
            "Starter Kits"
        ],
        "Tools and Prototyping": [
            "Breadboards",
            "Jumper Wires",
            "PCB Boards",
            "Soldering Equipment",
            "Multimeters",
            "Oscilloscopes"
        ]
    },

    "Mechanical Components": {
        "Fasteners": [
            "Bolts and Screws (Hex, Socket, Machine, Self-Tapping)",
            "Nuts (Hex, Wing, Lock, Cap)",
            "Washers (Flat, Spring, Lock)",
            "Rivets",
            "Threaded Rods",
            "Anchors and Inserts",
            "Clips and Clamps"
        ],
        "Gears and Transmission Components": [
            "Gears (Spur, Helical, Bevel, Worm)",
            "Pulleys and Sheaves",
            "Belts (Timing, V-Belt, Flat)",
            "Chains and Sprockets",
            "Couplings (Flexible, Rigid, Universal)",
            "Bearings (Ball, Roller, Thrust, Sleeve)",
            "Bushings"
        ],
        "Structural and Framing Components": [
            "Metal Profiles and Channels",
            "Aluminum Extrusions (T-slot profiles)",
            "Brackets and Mounting Plates",
            "Support Rails",
            "Panels and Enclosures",
            "Frames and Casings"
        ],
        "Motion and Linear Components": [
            "Linear Rails and Guides",
            "Lead Screws and Ball Screws",
            "Actuators (Linear, Pneumatic, Hydraulic)",
            "Sliders and Bearings",
            "Springs (Compression, Tension, Torsion)",
            "Dampers and Shock Absorbers"
        ],
        "Material Components": [
            "Metal Sheets and Rods (Aluminum, Steel, Brass)",
            "Plastics and Composites (Acrylic, Nylon, Delrin)",
            "Rubber Parts (Grommets, Pads, Seals)"
        ],
        "Machine Elements and Accessories": [
            "Handles and Knobs",
            "Hinges",
            "Latches and Locks",
            "Feet and Casters",
            "Inspection Windows",
            "Leveling Mounts"
        ],
        "Pneumatics and Hydraulics": [
            "Cylinders (Air, Oil)",
            "Valves (Control, Relief, Check)",
            "Fittings and Hoses",
            "Pumps and Reservoirs",
            "Manifolds and Regulators"
        ],
        "Tools and Assembly Equipment": [
            "Wrenches, Allen Keys, Screwdrivers",
            "Torque Wrenches",
            "Measuring Tools (Calipers, Micrometers)",
            "Vices and Clamps",
            "Cutting Tools (Blades, Drills, Taps and Dies)"
        ]
    },

    "Home Appliances": {
        "Kitchen Appliances": ["Refrigerators and Freezers", "Microwaves and Ovens", "Coffee Makers and Espresso Machines", "Blenders and Food Processors", "Dishwashers", "Cooktops and Ranges", "Rice Cookers and Slow Cookers", "Plates and Bowls", "Cutlery and Utensils", "Kitchen Storage and Organization"],
        "Laundry Appliances": ["Washing Machines", "Dryers", "Irons and Steamers"],
        "Heating and Cooling Appliances": ["Air Conditioners", "Heaters", "Fans", "Air Purifiers and Humidifiers"],
        "Home Comfort and Appliances": ["Vacuum Cleaners", "Water Heaters", "Air Fryers and Deep Fryers", "Dehumidifiers and Humidifiers"],
        "Smart Home Devices": ["Smart Speakers and Assistants", "Smart Lights and Bulbs", "Smart Plugs and Switches", "Smart Thermostats", "Smart Appliances"],
        "Security Cameras and Systems": ["Bullet Cameras", "Dome Cameras", "PTZ Cameras", "WIFI and 4G Cameras", "POE", "Hybrid AI-IoT NVR", "NVR", "DVR", "Surveillance Hard disk", "Backbox", "RJ45 Jacks", "Camera Protections", "Racks", "Accessories", "Biometrics and Sensors"]
    },

    "Gadgets": {
        "Wearable Technology": ["Smartwatches and Fitness Trackers", "Wireless Earbuds and Headphones", "Smart Glasses and VR Headsets"],
        "Mobile Devices and Accessories": ["Smartphones and Tablets", "Phone Cases and Screen Protectors", "Mobile Charging Devices"],
        "Personal Gadgets": ["Drones and UAVs", "Smart Cameras and Photography Gear", "Portable Speakers and Bluetooth Devices"],
        "Health and Wellness Gadgets": ["Air Purifiers and Humidifiers", "Fitness Gadgets and Accessories", "Massage Devices"],
        "Computers": ["Desktop Computers", "Laptops", "Printers", "Networking Devices", "Network Switches", "Others"],
        "Special Electronic Devices": ["Kaizen Meeting Time Keepers", "Others"]
    },
    "Medical, Laboratory and Hospital Equipment": {
        "Diagnostic Tools": ["Digital Thermometers", "Infrared Thermometers", "Stethoscopes", "Blood Pressure Monitors", "Pulse Oximeters", "Glucometers"],
        "Medical Instruments": ["Surgical Scalpels", "Hemostats and Forceps", "Needles and Sutures", "Scissors and Dissecting Tools", "Clamps and Retractors", "Bone Chisels and Mallets"],
        "Patient Monitoring Equipment": ["ECG Machines", "Blood Oxygen Monitors", "Thermometers", "Vital Sign Monitors", "Infusion Pumps", "Bedside Monitors", "Nurse Calling Systems"],
        "Lab Glassware and Consumables": ["Beakers and Flasks", "Petri Dishes", "Test Tubes and Racks", "Pipettes", "Lab Funnels and Filters", "Centrifuge Tubes"],
        "Lab Consumables": ["Sterilization Equipment", "Autoclaves", "UV Sterilizing Cabinets", "Steam Sterilizers", "Disinfectants and Cleaners"],
        "Surgical Instruments": ["Scalpels and Blades", "Surgical Forceps and Clamps", "Surgical Scissors", "Suture Kits", "Sponges", "Drapes and Gowns"],
        "Hospital Furniture": ["Electric and ICU Beds", "Examination Chairs", "Patient Recliners", "Stretchers", "Overbed Tables", "Medical Carts and Trolleys"]
    },

    "Office Supplies and Stationery": {
        "Paper": ["Copy Paper", "Graphing Paper", "Notebooks and Journals", "Cardstock and Specialty Paper", "Construction Paper", "Paper Rolls", "Envelopes"],
        "Writing Instruments": ["Ballpoint Pens", "Gel Pens", "Mechanical Pencils", "Highlighters", "Markers", "Fountain Pens", "Crayons and Colored Pencils"],
        "Desk Organizers and Storage": ["Desk Trays", "File Holders", "Drawer Organizers", "Document Racks", "Pen Holders", "Letter Sorters", "Shelving Units"],
        "Filing and Document Management": ["Filing Cabinets", "Hanging File Folders", "File Boxes", "Document Binders", "Labels and Label Makers", "Paper Clips and Staples", "Archive Boxes"],
        "Office Furniture": ["Ergonomic Office Chairs", "Standing Desks", "Office Workstations", "Filing Cabinets and Desks", "Conference Tables", "Bookshelves", "Task Lighting"],
        "Calendars and Planners": ["Wall Calendars", "Desk Planners", "Weekly and Monthly Planners", "Appointment Books", "Day Planners", "Pocket Calendars", "Digital Planners"],
        "Office Technology": ["Laser Printers", "Inkjet Printers", "3D Printers", "All-in-One Printers", "Scanners", "Fax Machines", "Paper Shredders"]
    },

    "Automotive Parts and Accessories": {
        "Car Batteries and Electrical Components": ["Lead-Acid and Lithium-Ion Car Batteries", "Alternators", "Starters and Solenoids", "Battery Chargers and Jump Starters", "Fuse Boxes and Relays", "Battery Terminals and Cables"],
        "Tires and Wheels": ["All-Season, Winter and Off-Road Tires", "Performance Tires", "Alloy and Steel Wheels", "Tire Pressure Monitors"],
        "Brake Parts and Suspension": ["Brake Pads and Shoes", "Brake Rotors and Drums", "Brake Calipers and Cylinders", "Shock Absorbers and Struts", "Suspension Springs and Bushings", "Brake Fluid and Hydraulic Components"],
        "Engine and Transmission Components": ["Timing Belts and Chains", "Pistons and Piston Rings", "Engine Blocks and Heads", "Transmission Fluid", "Clutch Kits and Parts", "Oil and Air Filters", "Radiators and Cooling Fans"],
        "Interior Accessories": ["Custom Seat Covers", "Floor Mats", "Steering Wheel Covers", "Car Organizers", "Dashboard Covers", "Car Upholstery", "Sunshades and Window Films"],
        "Exterior Accessories": ["Roof Racks and Cargo Carriers", "Tow Bars and Hitches", "Car Covers and Sunshades", "Side Steps and Running Boards", "Mud Flaps and Splash Guards", "Window Deflectors", "Car Mirrors and Lights"],
        "Tools for Automotive Repair and Maintenance": ["Automotive Diagnostic Tools", "Wrenches and Ratchets", "Torque Wrenches", "Car Jacks and Lifts", "Air Compressors and Pneumatic Tools", "Oil Change Tools", "Car Cleaning Tools"]

    },



    "Construction and Building Materials": {
        "Cement, Concrete and Mortar": ["Portland Cement", "Ready-Mix Concrete", "Mortar Mix", "Concrete Admixtures", "Quick-Set Cement", "Formwork and Sealers"],
        "Lumber and Wood Products": ["Softwood and Hardwood Lumber", "Plywood and MDF", "Wood Planks and Panels", "Pressure-Treated Lumber", "Timber Beams and Posts"],
        "Steel, Metal and Rebar": ["Steel Beams and Columns", "Rebar", "Galvanized Steel Sheets", "Metal Roofing and Cladding", "Stainless Steel Sheets and Bars"],
        "Insulation Materials": ["Fiberglass Insulation", "Spray Foam Insulation", "Rigid Foam Board", "Reflective and Acoustic Insulation", "Insulated Panels and Boards"],
        "Roofing and Siding": ["Asphalt Shingles", "Metal Roofing Sheets", "Roof Underlayment and Felt", "Vinyl and Fiber Cement Siding", "Cedar Wood Shingles", "Roof Flashing and Ventilation"],
        "Flooring": ["Ceramic and Porcelain Tiles", "Hardwood, Laminate and Vinyl Plank Flooring", "Carpets and Rugs", "Stone Flooring", "Carpet Underlayments"],
        "Paint and Coatings": ["Interior and Exterior Paint", "Primers and Sealers", "Waterproof and Epoxy Coatings", "Spray Paint", "Wood Stains and Finishes", "Anti-Corrosion Paint"]
    },

    "Farming and Agricultural Tools": {
        "Tractors and Agricultural Machinery": ["Compact Tractors", "Plows and Harrows", "Combine Harvesters", "Rotary Tillers", "Seeders and Planters", "Hay Balers", "Mowers and Brush Cutters"],
        "Irrigation Systems": ["Drip Irrigation Kits", "Sprinkler Systems", "Water Pumps", "Solenoid Valves", "Irrigation Hoses and Pipes", "Soaker Hoses", "Irrigation Controllers", "Flood Irrigation Systems"],
        "Seeds and Fertilizers": ["Vegetable, Flower and Turf Seeds", "Organic and Synthetic Fertilizers", "Soil Amendments", "Compost and Mulch"],
        "Livestock Equipment": ["Cattle Feeders and Waterers", "Chicken Coops and Nesting Boxes", "Horse Stalls and Fencing", "Livestock Scales", "Milking Machines", "Veterinary Tools", "Livestock Tags"],
        "Crop Protection": ["Insecticides and Pesticides", "Herbicides and Fungicides", "Weed Control", "Rodenticides", "Organic Crop Protection", "Crop Protection Sprayers"],
        "Hand Tools": ["Shovels, Rakes and Hoes", "Pruning Shears and Loppers", "Trowels and Spades", "Weeders and Cultivators", "Hedge Trimmers", "Garden Forks"],
        "Soil and Field Testing Equipment": ["Soil Test Kits", "pH and Moisture Meters", "Soil Temperature Gauges", "Conductivity Meters", "Compaction Testers", "Field Test Kits"]
    },

    "Packaging Solutions and Material Handling Equipment": {
        "Packaging Materials": ["Corrugated Boxes", "Bubble Wrap and Packing Peanuts", "Stretch Film and Shrink Wrap", "Poly Bags and Mailers", "Packing Tape and Dispensers", "Foam Inserts", "Wrapping Paper"],
        "Stretch Film and Shrink Wrap": ["Hand and Machine Stretch Film", "Shrink Wrap Rolls and Bags", "Stretch Film Dispensers", "Shrink Wrap Heat Guns", "Pallet Wrap"],
        "Pallets and Crates": ["Wooden and Plastic Pallets", "Stackable Crates and Pallets", "Bulk Storage Bins", "Plastic Crates and Totes"],
        "Conveyors and Belt Systems": ["Roller, Belt and Powered Conveyors", "Chain and Flexible Conveyors", "Conveyor Belts", "Overhead Conveyors"],
        "Forklifts and Pallet Jacks": ["Electric Forklifts", "Manual Pallet Jacks", "Stackers and Lifting Trucks", "Forklift Attachments", "Pallet Trucks"],
        "Labeling and Marking Systems": ["Barcode Printers and Scanners", "Labeling and Handheld Printers", "Thermal and Inkjet Printers", "RFID Tags and Printers"],
        "Packaging Tape and Dispensers": ["Clear and Duct Tape", "Packing Tape Dispensers", "Double-Sided and Waterproof Tape", "Stretch and Fragile Tape"]
    },

    "Food and Beverage Products": {
        "Beverages": ["Carbonated Soft Drinks", "Energy Drinks", "Fruit Juices", "Bottled Water", "Beer and Wine", "Coffee and Tea", "Sports Drinks"],
        "Snacks and Confectioneries": ["Chips and Pretzels", "Cookies and Crackers", "Candy and Chocolates", "Nuts and Dried Fruits", "Snack Bars", "Popcorn", "Granola and Trail Mix"],
        "Dairy Products": ["Milk and Cream", "Cheese", "Yogurt and Kefir", "Butter and Margarine", "Ice Cream and Frozen Desserts", "Whey Protein", "Dairy-Free Alternatives"],
        "Meat and Seafood": ["Fresh Meat", "Processed Meats", "Frozen Seafood", "Fresh Fish", "Canned Meats and Seafood", "Game Meat", "Meat Substitutes"],
        "Fresh Produce": ["Fresh Fruits", "Fresh Vegetables", "Organic Produce", "Herbs and Spices", "Citrus Fruits", "Exotic Fruits", "Root Vegetables"],
        "Frozen Foods": ["Frozen Meals", "Frozen Vegetables and Fruits", "Frozen Meat and Fish", "Frozen Pizzas and Snacks", "Frozen Desserts and Ice Cream", "Frozen Breakfast Foods"],
        "Spices and Seasonings": ["Black Pepper", "Salt", "Cumin", "Turmeric", "Paprika", "Garlic Powder"],
        "Cooking Oils": ["Olive Oil", "Vegetable Oil", "Coconut Oil", "Others"],
        "Vinegar and Sauces": ["Balsamic Vinegar", "Soy Sauce", "Hot Sauce", "BBQ Sauce"],
        "Grains and ice": ["Basmati Rice", "Brown Rice", "Quinoa", "Oats"],
        "Flours and Baking Ingredients": ["All-Purpose Flour", "Almond Flour", "Yeast", "Baking Powder"],
        "Sugars and Sweeteners": ["White Sugar", "Brown Sugar", "Honey", "Stevia"],
        "Canned and Jarred Goods": ["Pickles", "Olives", "Sauerkraut"],
        "Pasta and Noodles": ["Spaghetti", "Macaroni", "Udon", "Rice Noodles"],
        "Condiments and Dressings": ["Ketchup", "Mustard", "Mayonnaise", "Salad Dressings"]
    },

    "Apparel and Fashion Items": {
        "Men's Clothing": ["T-Shirts", "Jeans and Trousers", "Jackets and Blazers", "Sweaters and Hoodies", "Shorts and Cargo Pants", "Suits", "Sportswear"],
        "Women's Clothing": ["Dresses and Gowns", "Tops and Blouses", "Skirts and Pants", "Sweaters and Cardigans", "Outerwear", "Activewear", "Maternity Clothing"],
        "Footwear": ["Casual Shoes", "Work Boots", "Sandals and Flip-Flops", "Dress Shoes and Heels", "Running Shoes", "Sports Shoes", "Winter Boots"],
        "Accessories": ["Belts", "Hats and Caps", "Scarves and Gloves", "Jewelry", "Sunglasses", "Watches", "Bags and Wallets", "Head wear", "Hair Accessories"],
        "Sportswear and Activewear": ["Running Gear", "Yoga Pants", "Athletic Jackets", "Sports Bras", "Gym Shoes", "Sports Socks", "Swimwear"],
        "Outerwear": ["Winter Coats", "Raincoats", "Bomber Jackets", "Leather Jackets", "Puffer Jackets", "Wool Coats", "Ski Jackets"],
        "Kids' Clothing and Babywear": ["Baby Onesies", "Kids’ T-Shirts", "Toddler Shoes", "Baby Hats", "Baby Blankets", "Baby Jackets", "Boys' and Girls' Outerwear"]
    },

    "Toys and Games": {
        "Educational Toys": ["STEM Kits", "Puzzle Games", "Building Blocks", "Flash Cards", "Science Kits"],
        "Action Figures and Dolls": ["Superhero Action Figures", "Fashion Dolls", "Anime Figures", "Collectible Figures"],
        "Outdoor and Sports Toys": ["Bicycles and Scooters", "Frisbees", "Water Guns", "Kites", "Balls"],
        "Electronic and Remote Control Toys": ["Remote Control Cars", "Drones for Kids", "Robotic Toys", "Talking Toys"],
        "Creative and Art Toys": ["Crayons and Drawing Kits", "Craft Kits", "Coloring Books", "Clay and Play Dough"],
        "Board Games and Card Games": ["Strategy Board Games", "Family Card Games", "Party Games", "Educational Games"],
        "Infant and Toddler Toys": ["Rattles", "Teething Toys", "Soft Toys", "Musical Toys for Toddlers"],
        "Plush and Soft Toys": ["Stuffed Animals", "Plush Dolls", "Cuddly Toys"],
        "Building and Construction Toys": ["LEGO Sets", "Magnetic Tiles", "Wooden Blocks"]
    },
    "Electric Switchgear and Accessories": {

        "Circuit Breakers and Fuses": ["Miniature Circuit Breakers (MCB)", "Molded Case Circuit Breakers (MCCB)", "Residual Current Circuit Breakers (RCCB)", "Air Circuit Breakers (ACB)", "Fuses and Fuse Holders", "Earth Leakage Circuit Breakers (ELCB)", "High Rupturing Capacity (HRC) Fuses"],
        "Switches and Isolators": ["Main Switches", "Rotary Isolators", "Changeover Switches", "Load Break Switches", "Push Button Switches", "Cam Operated Switches", "Toggle and Rocker Switches"],
        "Distribution Boards and Panels": ["Consumer Units", "Power Distribution Boards", "DB Boxes", "Feeder Pillars", "Control Panels", "Modular Distribution Boards", "Panel Enclosures"],
        "Contactors and Relays": ["Electromagnetic Contactors", "Thermal Overload Relays", "Auxiliary Relays", "Solid-State Relays", "Time Delay Relays", "Motor Protection Relays", "Voltage Monitoring Relays"],
        "Motor Starters and Drives": ["DOL Starters", "Star Delta Starters", "Soft Starters", "Variable Frequency Drives (VFD)", "Motor Control Centers", "Manual Motor Starters", "AC/DC Drives"],
        "Busbar and Cabling Accessories": ["Busbar Chambers", "Busbar Supports", "Cable Lugs and Glands", "Cable Trays", "Flexible Copper Conductors", "PVC Insulated Wires", "Terminal Blocks"],
        "Meters and Monitoring Devices": ["Digital Energy Meters", "Ammeter and Voltmeter", "Multifunction Meters", "Power Factor Meters", "Phase Sequence Indicators", "Data Loggers", "Panel Mounting Meters"],
        "Protection Devices and Accessories": ["Surge Protection Devices", "Lightning Arresters", "Earth Fault Relays", "Protection Relays", "Insulation Monitoring Devices", "Arc Fault Detectors", "Grounding Accessories"],

    },
    "Electric Panel Bleeding – Causes, Safety Measures, and Tools": {
        "Causes of Panel Bleeding": [
            "Current Leakage to Ground",
            "Moisture or Water Ingress",
            "Overheating of Cables or Terminals",
            "Loose or Corroded Connections",
            "Damaged Insulation",
            "Improper Load Distribution",
            "Aging Components and Panels"
        ],

        "Detection and Diagnostic Tools": [
            "Insulation Resistance Testers (Megger)",
            "Thermal Imaging Cameras",
            "Earth Leakage Detectors",
            "Digital Multimeters",
            "Clamp Meters with Leakage Function",
            "Voltage Test Pens",
            "Circuit Analyzers"
        ],

        "Preventive Measures and Maintenance": [
            "Regular Thermal Scanning",
            "Moisture-Proof Enclosures (IP Rated)",
            "Scheduled Panel Inspections",
            "Tightening Terminal Connections",
            "Cleaning Dust and Debris",
            "Proper Cable Management",
            "Use of Surge Protection Devices"
        ],

        "Emergency Response Gear": [
            "Insulated Gloves and Mats",
            "Lockout Tagout (LOTO) Kits",
            "Arc Flash Suits",
            "Voltage Detectors",
            "First Aid Kits",
            "Fire Extinguishers (Class C for Electrical Fires)",
            "Warning Signage and Barricades"
        ],

        "Corrective Components and Accessories": [
            "Residual Current Devices (RCD)",
            "Miniature Circuit Breakers (MCB)",
            "Busbar Insulation Shrouds",
            "Heat Shrink Tubing",
            "Cable Insulation Tape",
            "Thermal Sensors and Relays",
            "Panel Cooling Fans and Louvers"
        ]
    },
    "Clean Room Components and Equipment": {

        "Air Filtration Systems": [
            "HEPA Filters (High Efficiency Particulate Air)",
            "ULPA Filters (Ultra-Low Penetration Air)",
            "Pre-Filters",
            "Fan Filter Units (FFUs)",
            "Air Showers",
            "Laminar Flow Units",
            "Air Curtains"
        ],

        "Clean Room Garments": [
            "Coveralls and Bunny Suits",
            "Cleanroom Hoods",
            "Boot Covers and Shoe Covers",
            "Face Masks and Beard Covers",
            "Sleeve Protectors",
            "Anti-Static Clothing",
            "Disposable Cleanroom Apparel"
        ],

        "Clean Room Equipment": [
            "Stainless Steel Work Tables",
            "Cleanroom Chairs and Stools",
            "Pass-Through Chambers",
            "Garment Cabinets",
            "Storage Racks and Shelves",
            "Cleanroom Trolleys and Carts",
            "Weighing and Sampling Booths"
        ],

        "Contamination Control Supplies": [
            "Sticky Mats and Tacky Rollers",
            "Cleanroom Wipers and Mops",
            "Disinfectant Sprays and Solutions",
            "Vacuum Cleaners for Cleanrooms",
            "Surface Particle Counters",
            "Waste Disposal Bins",
            "Lint-Free Cleaning Cloths"
        ],

        "Environmental Monitoring Devices": [
            "Particle Counters",
            "Temperature and Humidity Sensors",
            "Differential Pressure Gauges",
            "Microbial Air Samplers",
            "Air Velocity Meters",
            "CO2 and VOC Monitors",
            "Real-Time Monitoring Systems"
        ],

        "Electrical and Lighting Fixtures": [
            "Cleanroom Light Panels",
            "Sealed LED Fixtures",
            "EMI/RFI Shielded Outlets",
            "Flush-Mounted Switches and Sockets",
            "Static Dissipative Flooring",
            "Emergency Lighting Systems",
            "Power Supply Panels for Cleanroom Use"
        ],

        "Clean Room Construction Materials": [
            "Modular Wall Panels",
            "Walkable and Non-Walkable Ceilings",
            "Epoxy and Vinyl Flooring",
            "Flush-Mounted Doors and Windows",
            "Coving and Coved Base Systems",
            "Sealed Ceiling Grids",
            "Antimicrobial Coatings and Sealants"
        ]
    }
};

module.exports = categoryHierarchy;
