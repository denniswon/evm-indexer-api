package db

import (
	"encoding/json"
	"io/ioutil"
	"log"

	"gorm.io/gorm"
)

// AddNewSubscriptionPlan - Adding new subcription plan to database
// after those being read from .plans.json
func AddNewSubscriptionPlan(_db *gorm.DB, name string, deliveryCount uint64) {

	if err := _db.Create(&SubscriptionPlans{
		Name:          name,
		DeliveryCount: deliveryCount,
	}).Error; err != nil {
		log.Printf("[!] Failed to add subscription plan : %s\n", err.Error())
	}

}

// PersistAllSubscriptionPlans - Given path to user created subscription plan
// holder ``.plans.json` file, it'll read that content into memory & then parse JSON
// content of its, which will be persisted into database, into `subscription_plans` table
func PersistAllSubscriptionPlans(_db *gorm.DB, file string) {

	data, err := ioutil.ReadFile(file)
	if err != nil {
		log.Fatalf("[!] Failed to read content from subscription plan file : %s\n", err.Error())
	}

	type Plan struct {
		Name          string `json:"name"`
		DeliveryCount uint64 `json:"deliveryCount"`
	}

	type Plans struct {
		Plans []*Plan `json:"plans"`
	}

	var plans Plans

	if err := json.Unmarshal(data, &plans); err != nil {
		log.Fatalf("[!] Failed to parse JSON content from subscription plan file : %s\n", err.Error())
	}

	for _, v := range plans.Plans {
		AddNewSubscriptionPlan(_db, v.Name, v.DeliveryCount)
	}

	log.Printf("[+] Successfully persisted subscription plans into database")

}