del _tsfile
dir /S /B *.ts | findstr /V /I "node_modules" > _tsfile
tsc -m "commonjs" @_tsfile

