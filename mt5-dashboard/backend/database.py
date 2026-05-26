from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./vaultex.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, nullable=False)
    login = Column(String, nullable=False)
    server = Column(String, nullable=False)
    password_enc = Column(String, nullable=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Trade(Base):
    __tablename__ = "trades"
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, nullable=False)
    ticket = Column(Integer, unique=True)
    symbol = Column(String)
    type = Column(String)  # BUY / SELL
    lots = Column(Float)
    entry_price = Column(Float)
    exit_price = Column(Float, nullable=True)
    sl = Column(Float, nullable=True)
    tp = Column(Float, nullable=True)
    profit = Column(Float, nullable=True)
    open_time = Column(DateTime)
    close_time = Column(DateTime, nullable=True)
    status = Column(String, default="open")  # open / closed
    journal_notes = Column(Text, nullable=True)
    strategy_tag = Column(String, nullable=True)
    lessons = Column(Text, nullable=True)
    screenshot_url = Column(String, nullable=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
