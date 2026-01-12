CREATE TABLE
    IF NOT EXISTS sensor_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        data_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        synced BOOLEAN NOT NULL DEFAULT 0,
        active_sensors TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES sensor_groups (id)
    );
 