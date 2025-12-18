CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = subway_finder
SOURCES = graph.c main.c
HEADERS = graph.h

all: $(TARGET)

$(TARGET): $(SOURCES) $(HEADERS)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCES)

clean:
	rm -f $(TARGET) *.o

run: $(TARGET)
	./$(TARGET)

test:
	./$(TARGET) 刘园 天津站

.PHONY: all clean run test