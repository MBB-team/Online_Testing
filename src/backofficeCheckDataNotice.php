<?php
include('portailLib/backoffice.php');
?>
<!DOCTYPE html>
<html>
    <head>
    <meta charset='UTF-8'>
    <link href='css/backoffice.css' rel='stylesheet' type='text/css'>
    </head>
    <body>
        
Pour les sessions précédants le 20 aout 2020, si un participant lancait plusieurs tâches simultanéments dans le même navigateur, les données étaients sauvgardées avec le dernier runID généré.<br>
<br>
Cela entraine une liaison avec une tâche et/ou une session qui ne correspond(ent) pas à la table de données.<br>
Lors d'un export pour une session ces données n'apparaissent pas.<br>
Lors d'un export global pour la tâche, ces données contiennent des informations erronnées pour les colonnes relatives au run, à la tâche et à la session.<br>
<br>
L'outil de vérification recherche les lignes ayant un runID ne correspondant pas à la tâche et propose des runs pouvant correspondre en se basant sur la colonne 'date' (valeur générée en début de tâche par le code javascript).<br>
Les données telles qu'enregistrées peuvent être téléchargées <button class="download" title="Exporter les données brutes"><i class="material-icons">get_app</i></button> pour vérifier la correspondance (surtout utile si plusieurs runs peuvent correspondre).<br>
La dernière colonnes permet de télécharger <button class="download" title="Exporter les données corrigées"><i class="material-icons">get_app</i><i class="material-icons">build</i></button> les données corrigées avec les informations du run de référence.<br>
<br>
La base de données n'est pas modifiée.<br>
    </body>
</html>
