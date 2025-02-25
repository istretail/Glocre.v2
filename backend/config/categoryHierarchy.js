const categoryHierarchy = {
    "Personal Protective Equipment (PPE) and Safety Gear": {
        "Face Masks and Respirators": ["Surgical Masks", "N95 Respirators", "Dust Masks", "Face Shields", "Reusable Face Masks", "Anti - Fog Masks", "Respirator Cartridges and Filters"], 
        "Gloves and Hand Protection": ["Disposable Gloves", "Cut - Resistant Gloves", "Heat - Resistant Gloves", "Rubber Gloves", "Leather Work Gloves", "Medical Examination Gloves", "Finger Guards"],
        "Eye Protection": ["Safety Glasses",  "Welding Goggles", "Impact - Resistant Goggles", "Face Shields", "Prescription Safety Glasses", "Laser Protection Glasses", "Anti - Scratch and Anti - Fog Lenses"],
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
    "Electrical Instruments and Appliances ":{
        "Circuit Breakers and Fuses": ["Miniature Circuit Breakers, Molded Case Circuit Breakers", "Fuse Holders and Bases", "Cartridge Fuses", "Thermal Circuit Breakers", "Resettable Fuses", "Surge Protection Devices "],
        "Cable and Wiring": ["Electrical Cables, Extension Cords", "Coaxial Cables", "Ethernet Cables", "Power Cords and Plugs", "PVC Insulated Wires", "Armored Cables "], 
        "Electrical Testers and Meters": ["Multimeters, Clamp Meters", "Circuit Testers", "Voltage Detectors", "Insulation Resistance Testers", "Power Analyzers", "Earth Ground Resistance Meters "],
        "Switches and Sockets": ["Light Switches, Dimmer Switches", "Electrical Outlets", "GFCI Outlets", "Smart Switches", "Push Button Switches", "USB Wall Outlets", "Electrical Outlet Boxes "],  
        "Lighting Fixtures and Bulbs": ["LED Bulbs, Incandescent Bulbs", "Fluorescent Lights", "Pendant Lighting", "Recessed Lighting", "Emergency and Exit Lighting", "Floodlights and Spotlights", "Lamp Fixtures and Bases "],
        "Power Strips and Extension Cords": ["Surge Protector Power Strips, Heavy - Duty Extension Cords", "Wall - Mountable Power Strips", "Multi - Outlets", "Cordless Power Strips", "Power Cords for Appliances", "Extension Cord Reels "],
        "Electric Motors and Transformers": ["Induction Motors, Synchronous Motors", "Step - Up / Step - Down Transformers", "Brushless Motors", "Electric Actuators", "DC Motors", "Servo Motors", "Motor Controllers "],

    },
    "Home Appliances":{
        "Kitchen Appliances": ["Refrigerators and Freezers","Microwaves and Ovens","Coffee Makers and Espresso Machines","Blenders and Food Processors","Dishwashers","Cooktops and Ranges","Rice Cookers and Slow Cookers"],
        "Laundry Appliances": ["Washing Machines", "Dryers","Irons and Steamers"],
        "Heating and Cooling Appliances": ["Air Conditioners", "Heaters", "Fans","Air Purifiers and Humidifiers"],
        "Home Comfort and Appliances": ["Vacuum Cleaners", "Water Heaters", "Air Fryers and Deep Fryers","Dehumidifiers and Humidifiers"],
    },
    "Gadgets":{
        "Smart Home Devices": ["Smart Speakers and Assistants", "Smart Lights and Bulbs", "Smart Plugs and Switches", "Security Cameras and Systems", "Smart Thermostats","Smart Appliances"],
        "Wearable Technology": ["Smartwatches and Fitness Trackers", "Wireless Earbuds and Headphones","Smart Glasses and VR Headsets"],
        "Mobile Devices and Accessories": ["Smartphones and Tablets", "Phone Cases and Screen Protectors","Mobile Charging Devices"],
        "Personal Gadgets": ["Drones and UAVs", "Smart Cameras and Photography Gear","Portable Speakers and Bluetooth Devices"],
        "Health and Wellness Gadgets": ["Air Purifiers and Humidifiers", "Fitness Gadgets and Accessories","Massage Devices"],
    },
    "Medical, Laboratory and Hospital Equipment": {
        "Diagnostic Tools": ["Digital Thermometers", "Infrared Thermometers", "Stethoscopes", "Blood Pressure Monitors", "Pulse Oximeters", "Glucometers"],
        "Medical Instruments": ["Surgical Scalpels", "Hemostats and Forceps", "Needles and Sutures", "Scissors and Dissecting Tools", "Clamps and Retractors", "Bone Chisels and Mallets"],
        "Patient Monitoring Equipment": ["ECG Machines", "Blood Oxygen Monitors", "Thermometers", "Vital Sign Monitors", "Infusion Pumps", "Bedside Monitors"],
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
        "Irrigation Systems": ["Drip Irrigation Kits", "Sprinkler Systems", "Water Pumps", "Irrigation Hoses and Pipes", "Soaker Hoses", "Irrigation Controllers", "Flood Irrigation Systems"],
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
        "Canned and Packaged Goods": ["Canned Vegetables and Fruits", "Canned Soups and Stews", "Canned Beans and Legumes", "Canned Meats and Fish", "Ready Meals", "Pasta and Noodles", "Canned Juices"],
        "Spices and Seasonings": ["Black Pepper", "Salt", "Cumin", "Turmeric", "Paprika", "Garlic Powder"],
        "Cooking Oils": ["Olive Oil", "Vegetable Oil", "Coconut Oil"],
        "Vinegar and Sauces": ["Balsamic Vinegar", "Soy Sauce", "Hot Sauce", "BBQ Sauce"],
        "Grains and Rice": ["Basmati Rice", "Brown Rice", "Quinoa", "Oats"],
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
        "Accessories": ["Belts", "Hats and Caps", "Scarves and Gloves", "Jewelry", "Sunglasses", "Watches", "Bags and Wallets"],
        "Sportswear and Activewear": ["Running Gear", "Yoga Pants", "Athletic Jackets", "Sports Bras", "Gym Shoes", "Sports Socks", "Swimwear"],
        "Outerwear": ["Winter Coats", "Raincoats", "Bomber Jackets", "Leather Jackets", "Puffer Jackets", "Wool Coats", "Ski Jackets"],
        "Kids' Clothing and Babywear": ["Baby Onesies", "Kids’ T-Shirts", "Toddler Shoes", "Baby Hats", "Baby Blankets", "Baby Jackets", "Boys' and Girls' Outerwear"]
    },

};

module.exports = categoryHierarchy;
