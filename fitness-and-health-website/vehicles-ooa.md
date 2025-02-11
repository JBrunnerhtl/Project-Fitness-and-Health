# Vehicles OOA 
### von Jan, Ernad, Lorenz

Passagier Fahrzeuge:   
- Autos:  
- Elektro Autos:  
- Fahrrad:  

Materialtransport Fahrzeuge:  
- LKW:
- E-LKW:


### Energyquelle und Wiederbefüllung:
Mit Sprit: Benzin oder Diesel bei einer Tankstelle  
Electric Fahrzeuge: Batterie oder Tankstelle  
Bicycle: brauchen nichts


### Fahrbedingungen (enum):  
- City Roads: stops, wenig Geschw. höhere energie verbrauch: 1.2 consuption, 0.6 Speed
- Highway: schneller, niedrigere energie Verbrauch: 0.8 consuption, 1.2 Speed
- Backroad: durchsch. Geschw:  1.1 consumption, 0.9 speed
- Offroad: schwierige Umgebung, höherer Energieverbrauch: 1.5 consumption, 0.5 speed


### Fuel und Energy Verbrauch:  
- Motor Effizienz
- Baterie Kapazität
- Terrain und Roadtype

### Zeit und Geschwindigkeit:
- Fahrzeugtyp: Passagier fahren schneller als Trucks
- Fahrmodus: Highway fahren schneller, offroad langsamer
- Energie availability: das ausrennen des Benzin oder Strom limitiert die Distanz

Was soll die Software können:  
Ein Model von Fahrzeugen besitzen, das gemeinsame Eigenschaften auf den entsprechenden Ebenen zusammenfasst.
Zudem die Berechnung von Verbrauch Zeit für eine gegebene Strecke basierend auf Fahrzeugtyp und Bedingungen. Außerdem muss man die Fähigkeiten des Modells mit einem textbasierten Demoprogramm demonstrieren.


## Klassen
Die base Klasse ist Fahrzeuge(Vehicles)  
Unterklassen wie Auto(Car), Fahrrad(Bicyle), Elektroautos(e-cars), Lastwagen(truck), E-Lastwagen(e-truck)

Also alle Fahrzeuge erben von der Hauptklasse Vehicles.

## Common Properties
Brand, max Speed, Owner, Price, Modell, Typ(Passenger/Truck), Antriebsart
