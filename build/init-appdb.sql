CREATE TABLE IF NOT EXISTS metrics (
  id           varchar(36) NOT NULL,
  user_id      varchar(36) NOT NULL,
  type         VARCHAR(32) NOT NULL,
  value        NUMERIC NOT NULL,
  unit         VARCHAR(32) NOT NULL,
  date         DATE NOT NULL,
  created_at   timestamp NOT NULL,

  CONSTRAINT metrics_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_metrics_user_id_type_date_created_at ON metrics (user_id, type, date DESC, created_at DESC);