package main

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		intervals, ok := r.URL.Query()["time"]
		urls := r.URL.Query()["url"]

		if !ok || len(intervals[0]) < 1 {
			http.ServeFile(w, r, "index.html")
			return
		}

		interval := intervals[0]
		url := urls[0]

		fmt.Fprintf(w, "OK")
		i, _ := strconv.ParseInt(interval, 0, 64)

		req := func() {
			http.Get(url)
		}

		time.AfterFunc(time.Duration(int(i))*time.Second, req)
		return
	})
	
	http.ListenAndServe(":3000", nil)
}
