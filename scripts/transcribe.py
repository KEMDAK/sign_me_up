#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar 23 13:46:35 2018

@author: badrawy
"""

import boto3
import time
import urllib.request
import sys

filePath = sys.argv[1]
counter = sys.argv[2]

fileName = filePath.split("/")
fileName = fileName[len(fileName)-1]

def add_to_s3(filepath):

    bucket_name="aisha1995"
    
    s3 = boto3.client('s3',
    region_name="us-east-1",
    aws_access_key_id="AKIAIWTLGL4MBJZMDY3Q",
    aws_secret_access_key="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")
    s3.upload_file(filepath, bucket_name, filepath)



def transcribe(filename):
    transcribe = boto3.client('transcribe')
    job_name = "tran_job_"+counter
    job_uri="https://s3-us-east-1.amazonaws.com/aisha1995/"+filename
    
    transcribe.start_transcription_job(
    TranscriptionJobName=job_name,
    Media={'MediaFileUri': job_uri},
    MediaFormat="mp3",
    LanguageCode='en-US')
    
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        time.sleep(5)

    link = status.get('TranscriptionJob').get('Transcript').get('TranscriptFileUri')
    contents = urllib.request.urlopen(link).read()
    print(contents)


add_to_s3(filePath)
transcribe(fileName)