# Web application


Auf der Seite Produkte kann der Benutzer seine Daten angeben und die perfekten Produkte für ihn werden ihn Vorgeschlagen.  

**Daten**:
- Gesundheitliches Problem
- max. Preis den der Kunde bereit ist auszugeben
- Kategorie des gesuchten Produkt. (Fitness Produkte, Supplemente, Ernährung)
  
Diese Informationen vom Kunden sollten reichen um eine gute Struktur sein, mit denen man nach passenden Produkten suchen kann. 

Auf der Ernährung-und Trainingsseite kann er ebenfalls seine Daten eingeben und der perfekte Trainingsplan und der passende Ernährungsplan werden ihm vorgeschlagen, so auch andersrum

**Umsetzung**:
Doch wie werden die passenden Produkte oder Pläne gesucht und vorgeschlagen, die Idee wäre eine API von einer KI die passende Produkte, mit den Daten sucht und im Internet oder Amazon die Produkte rausfiltert und diese werden dann auf der Webseite vorgeschlagen.

**API**
Es gibt eine API namentlich Amazon Product Avertising machen. Die macht genau folgendes.  
**Wie funktioniert die schnelle Anzeige der Produkte auf der Webseite?**
- Benutzereingaben erfassen: Der Nutzer gibt auf deiner Webseite bestimmte Kriterien ein, z. B.: Maximaler Preis Kategorie (z. B. Elektronik, Bücher) Keywords (z. B. "kabellose Kopfhörer"). Diese Daten werden sofort an deinen Server gesendet, z. B. über ein HTML-Formular oder eine AJAX-Anfrage.
- Daten an die Amazon API senden: Dein Server empfängt die Benutzereingaben und erstellt direkt eine API-Anfrage an die Amazon Product Advertising API. Amazon antwortet in der Regel innerhalb von wenigen Millisekunden bis wenigen Sekunden, abhängig von der Latenz und der Komplexität der Anfrage.
- Daten verarbeiten: Die API-Antwort enthält die gewünschten Produktdaten (z. B. Namen, Preise, Bilder, Produktlinks).
Dein Server verarbeitet diese Daten (z. B. das Parsen der XML-Antwort in ein JSON-Format) und leitet sie an deine Webseite weiter.

- Produkte auf der Webseite anzeigen: Die Produktdaten werden entweder:Dynamisch auf der Webseite aktualisiert: Mit JavaScript und Frameworks wie React oder Vue.js kannst du die Produktdaten direkt einfügen, ohne die Seite neu zu laden. Auf einer neuen Seite dargestellt: Die Produkte werden auf einer neuen Seite gerendert, wenn der Nutzer auf "Suchen" klickt (klassisches Seiten-Reload-Verhalten).
